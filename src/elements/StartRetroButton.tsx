import React from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRetro } from '../msal/services';
import RetroTimeInputDialog from '../atoms/RetroTimeInputDialog';
const styles = {
  goToRetroBtn: {
    height: '44px',
    marginTop: '44px',
  },
};
const StartRetroButton = () => {
  const {
    state: { retroId, retroStarted, retroDuration },
    commitAction,
  } = React.useContext(BoardContext);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(60);
  const navigate = useNavigate();

  const [global, dispatch] = React.useContext(GlobalContext);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const startRetro = (duration: number) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
      retroStatus: 'started',
      creatorId: global.currentRetro?.creatorId,
      userId: global.user?.id,
    }).then(async () => {
      if (global.currentRetro?.id) {
        const retrievedRetro = await getRetro(global.currentRetro.id);
        dispatch({
          type: ActionType.SET_CURRENT_RETRO,
          payload: { retro: retrievedRetro },
        });
      }

      saveAndProcessAction(BoardActionType.START_RETRO, {
        creatorId: global.currentRetro?.creatorId,
        retroDuration: duration,
      }).then(
        () => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        },
        () => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );
    });
  };

  React.useEffect(() => {
    if (retroStarted && retroId != undefined && retroId != '') {
      navigate(`/board/${retroId || global.currentRetro?.id}/pulsecheck`);
    }
  }, [retroStarted]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: any) => {
    setOpen(false);
  };
  const handleSubmit = (value: any) => {
    setOpen(false);
    setSelectedValue(value);
    startRetro(value);
  };
  return (
    <>
      {global?.currentRetro?.creatorId === global?.user?.id && (
        <>
          {' '}
          <Button
            variant="outlined"
            className="secondaryButton"
            style={styles.goToRetroBtn}
            onClick={() => setOpen(true)}
          >
            <span className="secondaryButtonText">Start retro</span>
          </Button>
          <RetroTimeInputDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
};

export default StartRetroButton;
