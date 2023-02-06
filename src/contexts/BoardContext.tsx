import { Action, BoardState } from '../types';
import {
  BOARD_STATE_MACHINE_VERSION,
  BoardActionType,
  processAction,
  validateAction,
} from '../statemachine/BoardStateMachine';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import React, { ComponentProps } from 'react';
import { addRetroAction, getRetroActions } from '../msal/services';

import { GlobalContext } from './GlobalContext';
import { INITIAL_COLUMNS } from '../constants';
import _ from 'lodash';
import log from 'loglevel';
import shortid from 'shortid';
import stringifyDate from 'json-stringify-date';
import { useSocket } from '../hooks/useSocket';
import { SocketContext } from './SocketProvider';

export interface ReducerPayload {
  parameters: any;
  userId: string;
  version?: number;
}

const SNAPSHOTS_ENABLED = true;
const SNAPSHOT_GAP = 40;
const MAX_SNAPSHOTS = 10;

type ContextType = {
  state: BoardState;
  commitAction: (
    type: BoardActionType,
    payload: ReducerPayload,
    privateAction?: boolean
  ) => void;
};
const BoardContext = React.createContext<ContextType>({
  state: initialBoardState(''),
  commitAction: () => {},
});

function initialBoardState(retroId: string): BoardState {
  return new BoardState(retroId, INITIAL_COLUMNS);
}

function BoardProvider(props: ComponentProps<any>) {
  const history = React.useRef<{ action: Action }[]>([]);

  const [{ currentRetro, user }] = React.useContext(GlobalContext);
  const socket = React.useContext(SocketContext);

  const [state, setState] = React.useState<BoardState>(initialBoardState(''));
  const [global, dispatch] = React.useContext(GlobalContext);
  const stateSnapshots = React.useRef<
    { index: number; actionId: string; state: BoardState }[]
  >([]);
  const lastActionTimestamp = React.useRef(0);
  const lastActionId = React.useRef('');
  const snapshotUnsubscriber = React.useRef<() => void>(() => {});

  function saveState(state: BoardState) {
    const value = stringifyDate.stringify({
      boardId: currentRetro?.id,
      history: history.current,
      lastActionTimestamp: lastActionTimestamp.current,
      lastActionId: lastActionId.current,
      state: state,
      version: BOARD_STATE_MACHINE_VERSION,
    });
    try {
      sessionStorage.setItem('BoardContext', value);
    } catch (e) {
      log.error(e);
    }
    return state;
  }

  function clearState() {
    sessionStorage.removeItem('BoardContext');
    history.current = [];
    lastActionTimestamp.current = -1;
    lastActionId.current = '';
    Object.assign(state, initialBoardState(''));
  }

  function loadState() {
    const loadedContext = sessionStorage.getItem('BoardContext');
    if (loadedContext) {
      const loadedContextParsed = stringifyDate.parse(loadedContext);
      if (
        loadedContextParsed.boardId === currentRetro?.id &&
        !!loadedContextParsed.lastActionTimestamp &&
        loadedContextParsed.version === BOARD_STATE_MACHINE_VERSION
      ) {
        history.current = loadedContextParsed.history;
        lastActionTimestamp.current = loadedContextParsed.lastActionTimestamp;
        lastActionId.current = loadedContextParsed.lastActionId;

        Object.assign(state, loadedContextParsed.state);
        return true;
      }
    }
    return false;
  }

  const commitAction = async (
    type: BoardActionType,
    payload: ReducerPayload,
    privateAction?: boolean
  ) => {
    if (
      validateAction(
        state,
        type,
        payload.parameters,
        user.id,
        undefined,
        payload.version
      )
    ) {
      const action: Action = {
        id: shortid.generate(),
        actionName: type,
        parameters: payload.parameters,
        userId: user.id,
        sourceActionId: lastActionId.current,
        sourceActionTimestamp: lastActionTimestamp.current,
        timestamp: lastActionTimestamp.current,
        version: BOARD_STATE_MACHINE_VERSION,
        date: new Date(), // Use local dates for self created actions, this will not be saved
        ...(privateAction
          ? { onlyVisibleBy: [currentRetro?.creatorId as string, user.id] }
          : {}),
      };
      await addRetroAction(currentRetro?.id as string, action);
    }
  };

  const processActions = (actions: Action[]): BoardState | undefined => {
    const actionSortFunction = (actionA: Action, actionB: Action) =>
      actionA.sourceActionTimestamp !== actionB.sourceActionTimestamp
        ? actionA.sourceActionTimestamp - actionB.sourceActionTimestamp
        : (actionA.timestamp ? actionA.timestamp : Number.MAX_SAFE_INTEGER) -
          (actionB.timestamp ? actionB.timestamp : Number.MAX_SAFE_INTEGER);
    actions.sort(actionSortFunction);

    actions.forEach(action => {
      const existingActionIndex = history.current.findIndex(
        (a: { action: { id: string } }) => a.action.id === action.id
      );

      // reapply action with timestamp from server
      if (existingActionIndex !== -1) {
        history.current[existingActionIndex].action = action;
      } else {
        history.current.push({
          action,
        });
      }
    });

    history.current.sort((a, b) => actionSortFunction(a.action, b.action));

    // first invalid snapshot
    if (SNAPSHOTS_ENABLED) {
      if (stateSnapshots.current && stateSnapshots.current.length !== 0) {
        // find where the first new action has landed
        const indexOfFirstNewAction = history.current.findIndex(
          entry => entry.action.id === actions[0].id
        );
        const invalidSnapshotIndex = stateSnapshots.current.findIndex(
          ({ index }) => index >= indexOfFirstNewAction
        );
        if (invalidSnapshotIndex !== -1) {
          // Remove all snapshots after invalid snapshot
          stateSnapshots.current.splice(invalidSnapshotIndex);
        }
      }
    }

    // Create new state or load from snapshot
    const newState =
      !SNAPSHOTS_ENABLED || stateSnapshots.current.length === 0
        ? initialBoardState(state.retroId)
        : _.cloneDeep(
            stateSnapshots.current[stateSnapshots.current.length - 1].state
          );
    const startIndex =
      !SNAPSHOTS_ENABLED || stateSnapshots.current.length === 0
        ? 0
        : stateSnapshots.current[stateSnapshots.current.length - 1].index + 1;
    for (let index = startIndex; index < history.current.length; index++) {
      const action = history.current[index].action;
      if (
        validateAction(
          newState,
          action.actionName as BoardActionType,
          action.parameters,
          action.userId,
          action.date,
          action.version
        )
      ) {
        processAction(
          newState,
          action.actionName as BoardActionType,
          action.parameters,
          action.userId,
          action.date,
          action.version
        );
      }

      if (SNAPSHOTS_ENABLED) {
        const lastSnapshotIndex =
          stateSnapshots.current.length !== 0
            ? stateSnapshots.current[stateSnapshots.current.length - 1].index
            : 0;
        if (index - lastSnapshotIndex === SNAPSHOT_GAP) {
          stateSnapshots.current.push({
            actionId: action.id,
            index,
            state: _.cloneDeep(newState),
          });
          stateSnapshots.current = stateSnapshots.current.slice(-MAX_SNAPSHOTS);
        }
      }
      if (action.timestamp) {
        lastActionTimestamp.current = action.timestamp;
      }
      lastActionId.current = action.id;
    }

    saveState(newState);
    setState(newState);
    return newState;
  };

  React.useEffect(() => {
    snapshotUnsubscriber?.current();
    if (currentRetro?.id) {
      let loadedState = false;
      if (state.retroId === '' && loadState()) {
        loadedState = true;
        setState({ ...state });
      } else {
        clearState();
        state.retroId = currentRetro?.id;
      }

      getRetroActions(
        currentRetro?.id as string,
        user.id,
        lastActionTimestamp.current
      ).then(actions => {
        if (actions.length === 0 && !loadedState) {
          setState({ ...initialBoardState(currentRetro?.id), loading: false });
        }
        if (actions.length !== 0) {
          const newState = processActions(actions);
          if (newState) {
            setState(newState);
          }
        }
        socket.emit('retro', currentRetro?.id);
        socket.on(
          'newMessage',
          (snapshot: { retroId: string; action: any }[]) => {
            socket.on('disconnect',()=>{
              console.log("socket disconnected")
            })
            const results = [] as any[];
            snapshot.forEach((change: { retroId: string; action: any }) => {
              if (
                change.retroId === currentRetro?.id &&
                (change.action.sourceActionTimestamp >=
                  lastActionTimestamp.current ===
                undefined
                  ? 0
                  : lastActionTimestamp.current)
              ) {
                const data = change.action;
                if (
                  !data.onlyVisibleBy ||
                  data.onlyVisibleBy.includes(user.id)
                ) {
                  results.push(data);
                }
              }
              // }
            });
            actions = results;
            if (actions.length !== 0) {
              processActions(actions);
            }
          }
        );
      });
    } else {
      clearState();

    
    }
  }, [currentRetro?.id,currentRetro?.id&&socket]);

  
  return (
    <BoardContext.Provider value={{ state, commitAction }}>
      {!currentRetro && !state.loading ? (
        <Dialog open={true}>
          <DialogTitle>Loading board...</DialogTitle>
          <DialogContent>
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          </DialogContent>
        </Dialog>
      ) : null}

      {global.loadingFlag && (
        <Box
          sx={{
            zIndex: '1000',
            position: 'absolute',
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {props.children}
    </BoardContext.Provider>
  );
}

export { BoardProvider, BoardContext };
