import React, { ComponentProps, Dispatch } from 'react';
import {
  Global,
  PulseCheckSubmitStatus,
  Retro,
  SnackMessageClass,
  User,
} from '../types';

export enum ActionType {
  SET_CURRENT_RETRO = 'setCurrentRetro',
  CLOSE_CURRENT_RETRO = 'closeCurrentRetro',
  SET_USER = 'setUser',
  SET_PREFERRED_NICKNAME = 'setPreferredNickname',
  SET_SNACK_MESSAGE = 'setSnackMessage',
  SET_RETRO_CREATE = 'setRetroCreate',
  SET_PULSE_CHECK = 'setPulseCheck',
  SET_LOADING = 'setLoading',
  EXPAND_COLUMN = 'expandColumn',
  SET_USER_SELECTED = 'setUserSelected',
  SET_LEAVE_RETRO = 'setLeaveRetro',
  SET_FEEDBACK = 'setFeedback',
  CREATE_RETRO = 'createRetro',
  SET_EMOJI_ID="setEmojiId"
}

export class ReducerPayload {
  retro?: Partial<Retro>;
  user?: User;
  preferredNickname?: string;
  avatar?: string;
  snackMessage?: SnackMessageClass;
  retroCreateState?: boolean;
  pulseCheckState?: PulseCheckSubmitStatus;
  loadingFlag?: boolean;
  expandColumn?: number;
  usersSelected?: any[];
  userType?: number;
  leaveRetro?: boolean;
  feedbackSubmit?: boolean;
  isMobile?: boolean;
  emojiId?:string;
}

type ContextType = [
  Global,
  Dispatch<{ type: ActionType; payload?: ReducerPayload }>
];
const GlobalContext = React.createContext<ContextType>([
  new Global(),
  {} as Dispatch<{ type: ActionType; payload?: ReducerPayload }>,
]);

function saveState(state: Global) {
  sessionStorage.setItem('GlobalContext', JSON.stringify(state));
  return state;
}

function loadState() {
  const savedContext = sessionStorage.getItem('GlobalContext');
  var parsingSavedContext = savedContext
    ? JSON.parse(savedContext)
    : initialGlobalState();
  parsingSavedContext.loadingFlag = false;

  // return savedContext ? JSON.parse(savedContext) : initialGlobalState();
  return parsingSavedContext;
}

function initialGlobalState(): Global {
  return new Global();
}

function GlobalProvider(props: ComponentProps<any>) {
  function GlobalReducer(
    state: Global,
    action: { type: ActionType; payload?: ReducerPayload }
  ): Global {
    switch (action.type) {
      case ActionType.SET_USER:
        if (action.payload?.user && action.payload?.user.id) {
          return saveState({ ...state, user: action.payload?.user as User });
        }
        break;
      case ActionType.SET_CURRENT_RETRO:
        if (action.payload?.retro && action.payload?.retro.id) {
          return saveState({
            ...state,
            currentRetro: action.payload?.retro as Retro,
          });
        }
        break;
      case ActionType.CLOSE_CURRENT_RETRO:
        if (state.currentRetro) {
          return saveState({ ...state, currentRetro: undefined });
        }
        break;
      case ActionType.SET_PREFERRED_NICKNAME:
        return saveState({
          ...state,
          preferredNickname: action.payload?.preferredNickname,
          avatar: action.payload?.avatar,

          user: {
            ...state.user,
            name: action.payload?.preferredNickname + '',
            avatar: action.payload?.avatar + '',
            userType: action.payload?.userType ? action.payload.userType : 0,
          },
        });
      case ActionType.SET_SNACK_MESSAGE:
        return saveState({
          ...state,
          snackMessage: action.payload?.snackMessage as SnackMessageClass,
        });
      case ActionType.SET_RETRO_CREATE:
        return saveState({
          ...state,
          retroCreateState: action.payload?.retroCreateState,
        });
      case ActionType.SET_PULSE_CHECK:
        return saveState({
          ...state,
          pulseCheckState: action.payload?.pulseCheckState,
        });
      case ActionType.SET_LOADING:
        return saveState({
          ...state,
          loadingFlag: action.payload?.loadingFlag,
        });
      case ActionType.EXPAND_COLUMN:
        return saveState({
          ...state,
          expandColumn: action.payload?.expandColumn,
        });
      case ActionType.SET_USER_SELECTED:
        return saveState({
          ...state,
          usersSelected: action.payload?.usersSelected,
        });
      case ActionType.SET_LEAVE_RETRO:
        return saveState({
          ...state,
          leaveRetro: action.payload?.leaveRetro,
        });
        case ActionType.SET_EMOJI_ID:
          return saveState({
            ...state,
            emojiId:action.payload?.emojiId
          })
      case ActionType.SET_FEEDBACK:
        return saveState({
          ...state,
          feedbackSubmit: action.payload?.feedbackSubmit,
        });
      case ActionType.CREATE_RETRO:
        let tempState: any = new Global();
        tempState.user = { id: state.user.id };
        return saveState(tempState);
    }
    return saveState({ ...state });
  }

  const [state, dispatch] = React.useReducer(GlobalReducer, loadState());

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export { GlobalProvider, GlobalContext };
