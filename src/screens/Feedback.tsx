import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { BoardContext } from '../contexts/BoardContext';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../atoms/UserAvatar';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { GlobalContext } from '../contexts/GlobalContext';
import { FeedbackColumn } from '../elements/FeedbackColumn';
import useLoadRetro from '../hooks/useLoadRetro';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import theme from '../theme/theme';
import FeedbackPopup from '../atoms/FeedbackPopup';

export default function Feedback() {
  const navigate = useNavigate();

  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));

  const [{ user, currentRetro }] = React.useContext(GlobalContext);
  const {
    state: { creatorId, retroName, users, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [endedOnEntry, setEndedOnEntry] = React.useState(ended);

  useLoadRetro();

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user.id,
    });
  };

  const backToBoard = () => {
    if (ended && creatorId === user.id) {
      setConfirmAction({
        title: 'Back to Board',
        text: 'This action will take All Participants back.',
        action: 'Back to Board',
        onConfirm: () => {
          saveAndProcessAction(BoardActionType.END_RETRO, { undo: true }).then(
            () => {
              setConfirmAction(undefined);
              navigate('/board/' + currentRetro?.id);
            }
          );
        },
      });
    } else {
      navigate('/board/' + currentRetro?.id);
    }
  };

  React.useEffect(() => {
    if (!ended && ended !== endedOnEntry) {
      navigate(`/board/${currentRetro?.id}`);
    }
  }, [ended]);

  return (
    <Box
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar component="div" color="primary" position="static" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid
              item
              xs
              style={{
                display: 'flex',
                flexDirection: 'row',
                ...(isXsUp
                  ? {
                      flexGrow: 3,
                      justifyContent: 'center',
                    }
                  : {}),
              }}
            >
              <Container
                color="inherit"
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '40vw',
                    height: '100%',
                    display: 'block',
                    overflow: 'hidden',
                  }}
                >
                  {retroName}
                </Typography>
              </Container>
            </Grid>
            <Grid item xs sx={{ display: 'flex', justifyContent: 'end' }}>
              {users.map((user, i) =>
                i === 2 ? (
                  <span
                    key={user.userId}
                    style={{ marginLeft: '-8px', zIndex: 2 - i }}
                  >
                    <UserAvatar userNickname={'+' + (users.length - 2)} />
                  </span>
                ) : i < 2 ? (
                  <span style={{ marginLeft: '-8px', zIndex: 2 - i }}>
                    <UserAvatar
                      key={user.userId}
                      userNickname={user.userNickname}
                    />
                  </span>
                ) : null
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {!ended || creatorId === user.id ? (
        <AppBar
          component="div"
          position="static"
          elevation={0}
          sx={{
            zIndex: 0,
            display: 'flex',
            flexDirection: 'row',
            background: 'white',
            color: '#159ADD',
            padding: '5px 15px',
            alignContent: 'flex-middle',
          }}
        >
          <Typography
            sx={{
              fontSize: '1rem',
              flex: 1,
              fontWeight: 'bold',
              color: 'black',
              justifySelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
            }}
          ></Typography>

          <Button
            variant="outlined"
            sx={{
              ':hover': { background: '#695F9B' },
              background: '#695F9B',
              color: '#fff',
              justifySelf: 'flex-end',
            }}
            onClick={backToBoard}
            // onTouchStart={backToBoard}
          >
            Back to Board
          </Button>
        </AppBar>
      ) : null}

      <Box>
        <FeedbackPopup show={true} showThankYou={ended}></FeedbackPopup>
      </Box>
    </Box>
  );
}
