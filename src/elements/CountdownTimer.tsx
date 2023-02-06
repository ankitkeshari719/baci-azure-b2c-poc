import { BoardContext } from '../contexts/BoardContext';
import {
  Box,
  Button,
  Card,
  Typography,
  keyframes,
  styled,
  Popover,
  TextField,
  useMediaQuery,
} from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Countdown from 'react-countdown';
import Draggable from 'react-draggable';
import { GlobalContext } from '../contexts/GlobalContext';
import Pause from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import { Stop } from '@mui/icons-material';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import theme from '../theme/theme';

const RoundButton = styled('button')({
  background: '#159ADD',
  borderRadius: '25px',
  minWidth: 0,
  color: 'white',
  padding: '5px',
  border: '1px solid #159ADD',
  '&:hover': {
    background: 'white',
    color: '#159ADD',
    border: '1px solid #159ADD',
  },
});
const RoundButtonOrange = styled('button')({
  background: '#FBBC05',
  borderRadius: '25px',
  minWidth: 0,
  color: 'white',
  padding: '5px',
  border: '1px solid #FBBC05',
  '&:hover': {
    background: 'white',
    color: '#FBBC05',
    border: '1px solid #FBBC05',
  },
});
const RoundButtonRed = styled('button')({
  background: '#EA4335',
  borderRadius: '25px',
  minWidth: 0,
  color: 'white',
  padding: '5px',
  border: '1px solid #EA4335',
  '&:hover': {
    background: 'white',
    color: '#EA4335',
    border: '1px solid #EA4335',
  },
});

const scale = keyframes`
    0 {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
`;

export function CountdownTimer({
  color,
  bold,
}: {
  color: string;
  bold: boolean;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: {
      countdownFrom,
      countdownDuration,
      countdownPaused,
      countdownExpired,
      ended,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const countdownRef = React.createRef<Countdown>();
  const countdownInBoxRef = React.createRef<Countdown>();
  const [countdownWindowOpen, setCountdownWindowOpen] = React.useState(false);
  const timedelta = React.useRef(0);
  const previousExpired = React.useRef(false);
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));


  //
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCountdownWindowOpen(false);
  };

  // Check disabled for now
  const isRetroCreator = () => true; //global.currentRetro?.creatorId === global.user.id;

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const incrementTimer = async (amount: number) => {
    await saveAndProcessAction(BoardActionType.INCREMENT_TIMER, {
      fromDuration: countdownDuration,
      amount,
    });
  };

  const setTimer = async (amount: number) => {
    await saveAndProcessAction(BoardActionType.SET_TIMER, {
      fromDuration: countdownDuration,
      amount,
    });
  };

  const decrementTimer = async (amount: number) => {
    await saveAndProcessAction(BoardActionType.DECREMENT_TIMER, {
      fromDuration: countdownDuration,
      amount,
    });
  };

  const startTimer = async () => {
    await saveAndProcessAction(BoardActionType.START_TIMER, {
      startTime: Date.now() + timedelta.current,
      duration: countdownDuration,
    });
  };

  const stopTimer = async () => {
    await saveAndProcessAction(BoardActionType.STOP_TIMER, {});
  };

  const pauseTimer = async () => {
    await saveAndProcessAction(BoardActionType.PAUSE_TIMER, {
      remaining: countdownDuration - (Date.now() - countdownFrom),
    });
  };

  const resumeTimer = async () => {
    await saveAndProcessAction(BoardActionType.RESUME_TIMER, {
      from: Date.now() + timedelta.current,
    });
  };

  React.useEffect(() => {
    if (countdownRef && countdownRef.current !== null) {
      if (countdownFrom !== -1 && !countdownPaused) {
        (countdownRef.current as any).start();
      } else {
        (countdownRef.current as any).stop();
      }
    }
    if (countdownInBoxRef && countdownInBoxRef.current !== null) {
      if (countdownFrom !== -1 && !countdownPaused) {
        (countdownInBoxRef.current as any).start();
      } else {
        (countdownInBoxRef.current as any).stop();
      }
    }
  }, [
    countdownRef.current,
    countdownInBoxRef.current,
    countdownFrom,
    timedelta.current,
    countdownDuration,
    countdownPaused,
  ]);

  React.useEffect(() => {
    if (
      !previousExpired.current &&
      countdownExpired &&
      global.user.userType == 2
    ) {
      const audio = new Audio('../sounds/ding.mp3');
      audio.play();
    }
    previousExpired.current = countdownExpired;
  }, [countdownExpired]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {global.user?.userType == 2 && !ended && (
        <Button
          aria-describedby={id}
          sx={{ color: color, fontWeight: bold ? '700' : '400' }}
          onClick={async event => {
            handleClick(event);
            isRetroCreator();
            setCountdownWindowOpen(!countdownWindowOpen);
            if (countdownExpired) {
              await saveAndProcessAction(BoardActionType.STOP_TIMER, {});
            }
          }}
        >
          <Box
            sx={{
              background:
                countdownFrom === -1 && !countdownPaused && !countdownExpired
                  ? 'white'
                  : '#EE7538',
              borderRadius: '50px',
              height: '25px',
              minWidth: 0,
              color:
                countdownFrom === -1 && !countdownPaused && !countdownExpired
                  ? '#4E4E4E'
                  : 'white',
              padding: '5px',
              // border: '1px solid #159ADD',
              '&:hover': {
                background:
                  countdownFrom === -1 && !countdownPaused && !countdownExpired
                    ? '#EE7538'
                    : 'white',
                color:
                  countdownFrom === -1 && !countdownPaused && !countdownExpired
                    ? 'white'
                    : '#4E4E4E',
                // border: '1px solid #159ADD',
              },
            }}
          >
            <AccessTimeIcon></AccessTimeIcon>
          </Box>
        </Button>
      )}
      {countdownFrom === -1 && !countdownPaused && !countdownExpired ? (
        <></>
      ) : countdownExpired ? (
        <Typography
          sx={{
            display: 'flex',
            animation: `${scale} 500ms linear 10`,
            fontSize: isXsUp ? '30px' : '40px',
            color: '#EE7538',
            marginLeft: isXsUp ? '16px' : 0,
          }}
        >
          {`Time's up!`}
        </Typography>
      ) : (
        <Box color="inherit" fontWeight="inherit">
          <Countdown
            ref={countdownRef}
            autoStart={false}
            date={
              !countdownFrom || countdownFrom === -1
                ? Date.now() +
                  (countdownDuration ? countdownDuration : 0) +
                  timedelta.current
                : countdownFrom + countdownDuration
            }
            now={() => Date.now() + timedelta.current}
            onComplete={async () =>
              await saveAndProcessAction(BoardActionType.EXPIRE_TIMER, {})
            }
            renderer={({ minutes, seconds }) => (
              <Typography
                sx={{
                  fontSize: isXsUp ? '30px' : '56px',
                  color: '#EE7538',
                  marginLeft: isXsUp ? '16px' : 0,
                }}
              >
                {minutes < 10 ? '0' + minutes : minutes}:
                {seconds < 10 ? '0' + seconds : seconds}
              </Typography>
            )}
          />
        </Box>
      )}

      {/* <Draggable> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Card
          sx={{
            display: countdownWindowOpen ? '' : 'none',
            // display: 'flex',
            flexDirection: 'column',
            width: '332px',
            height: '295px',
            borderRadius: '10px',
            padding: '10px, 1px, 10px, 1px',
            bgcolor: '#FFFFFF',
            border: '1px solid #CCCCCC',
            boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              width: 'calc(100%)',
              marginTop: '16px',
            }}
          >
            <Box sx={{ color: '#2C69A1', fontSize: '24px', fontWeight: '500' }}>
              Timer
            </Box>
            <Box sx={{ position: 'absolute', right: '26px', top: '20px' }}>
              <Button
                // onTouchStart={event => {
                //   handleClose();
                // }}
                onClick={event => {
                  handleClose();
                }}
                sx={{
                  minWidth: '0',

                  padding: '2px',
                  margin: '4px',
                }}
              >
                <CloseIcon sx={{ height: '20px', color: '#4D555A' }} />
              </Button>
            </Box>
          </Box>
          {countdownExpired ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: '10px 20px',
                alignItems: 'center',
              }}
            >
              <Typography
                color="inherit"
                style={{
                  fontSize: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  animation: `${scale} 500ms linear 10`,
                }}
              >
                Time's Up!
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'space-evenly',
                // margin: '10px 20px',
                alignItems: 'center',
                // width:"calc(100%-10px)"
                height: '300px',
              }}
            >
              {/* <div
                style={{
                  minHeight: '160px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              > */}

              {/* {countdownFrom === -1 && !countdownPaused ? (
                    <Button
                      onClick={() => decrementTimer(60 * 1000)}
                      onTouchStart={() => decrementTimer(60 * 1000)}
                    >
                      <RemoveIcon></RemoveIcon>
                    </Button>
                  ) : null} */}
              <Countdown
                ref={countdownInBoxRef}
                autoStart={false}
                date={
                  !countdownFrom || countdownFrom === -1
                    ? Date.now() +
                      (countdownDuration ? countdownDuration : 0) +
                      timedelta.current
                    : countdownFrom + countdownDuration
                }
                now={() => Date.now() + timedelta.current}
                renderer={({ minutes, seconds }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      fontSize: '64px',
                      minHeight: '120px',
                      marginTop: '24px',
                      marginBottom: '10px',
                    }}
                  >
                    {countdownFrom === -1 && !countdownPaused ? (
                      // <Box component="span" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>

                      <span
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ height: '130px' }}>
                          <TextField
                            // onChange={handleNameChange}
                            value={minutes < 10 ? '0' + minutes : minutes}
                            onChange={async event => {
                              await saveAndProcessAction(
                                BoardActionType.SET_TIMER,
                                {
                                  fromDuration: countdownDuration,
                                  amount: +event.target.value * 60 * 1000,
                                }
                              );
                            }}
                            inputProps={{
                              style: { fontSize: '64px' },
                              min: 0,
                              max: 60,
                              maxLength: 2,
                            }} // font size of input text
                            InputLabelProps={{ style: { fontSize: 0 } }} // font size of input label
                            type="number"
                            sx={{
                              fontWeight: 300,
                              width: '122px',
                              height: '80px',
                            }}
                          />
                        </span>
                        <span style={{ fontSize: '16px', color: '#676767' }}>
                          min
                        </span>
                      </span>
                    ) : (
                      // min
                      // <Box>

                      <Box component="span" sx={{ padding: '10px' }}>
                        {minutes < 10 ? '0' + minutes : minutes}
                      </Box>
                    )}
                    {/* {minutes} */}:
                    {/* {seconds < 10 ? '0' + seconds : seconds} */}
                    {countdownFrom === -1 && !countdownPaused ? (
                      <span
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ height: '130px' }}>
                          <TextField
                            // onChange={handleNameChange}
                            value={seconds < 10 ? '0' + seconds : seconds}
                            onChange={async event => {
                              await saveAndProcessAction(
                                BoardActionType.SET_TIMER,
                                {
                                  fromDuration: countdownDuration,
                                  amount:
                                    +event.target.value * 1000 +
                                    minutes * 60 * 1000,
                                }
                              );
                            }}
                            inputProps={{
                              style: { fontSize: '64px' },
                              min: 0,
                              max: 60,
                              maxLength: 2,
                            }} // font size of input text
                            InputLabelProps={{ style: { fontSize: 0 } }} // font size of input label
                            type="number"
                            sx={{
                              fontWeight: 300,
                              width: '122px',
                              height: '80px',
                            }}
                          />
                        </span>
                        <span style={{ fontSize: '16px', color: '#676767' }}>
                          sec
                        </span>
                      </span>
                    ) : (
                      <Box component="span" sx={{ padding: '10px' }}>
                        {seconds < 10 ? '0' + seconds : seconds}
                      </Box>
                    )}
                  </Box>
                )}
              />
              {/* {countdownFrom === -1 && !countdownPaused ? (
                    <Button
                      onClick={() => incrementTimer(60 * 1000)}
                      onTouchStart={() => incrementTimer(60 * 1000)}
                    >
                      <AddIcon></AddIcon>
                    </Button>
                  ) : null} */}

              {/* <Box style={{ display: 'flex', justifyContent: 'center' }}>
                  {countdownFrom !== -1 || countdownPaused ? (
                    <Button
                      onClick={() => incrementTimer(60 * 1000)}
                      onTouchStart={() => incrementTimer(60 * 1000)}
                    >
                      <Typography
                        style={{
                          background: '#4D555A',
                          color: 'white',
                          borderRadius: '3px',
                          padding: '3px',
                        }}
                      >
                        +1m
                      </Typography>
                    </Button>
                  ) : null}
                  {countdownFrom !== -1 || countdownPaused ? (
                    <Button
                      onClick={() => incrementTimer(5 * 60 * 1000)}
                      onTouchStart={() => incrementTimer(5 * 60 * 1000)}
                    >
                      <Typography
                        style={{
                          background: '#4D555A',
                          color: 'white',
                          borderRadius: '3px',
                          padding: '3px',
                        }}
                      >
                        +5m
                      </Typography>
                    </Button>
                  ) : null}
                </Box> */}
              {/* </div> */}

              <Box
                style={{
                  display: 'flex',
                  gap: '6px',
                  minHeight: '36px',
                  minWidth: '140px',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
              >
                {countdownFrom !== -1 && !countdownPaused && (
                  <RoundButtonOrange
                    onClick={pauseTimer}
                    // onTouchStart={pauseTimer}
                  >
                    <Pause></Pause>
                  </RoundButtonOrange>
                )}
                {countdownFrom === -1 && countdownPaused && (
                  <RoundButton
                    onClick={resumeTimer}
                    // onTouchStart={resumeTimer}
                  >
                    <PlayArrowIcon></PlayArrowIcon>
                  </RoundButton>
                )}
                {countdownFrom === -1 && !countdownPaused ? (
                  <RoundButton
                    onClick={startTimer}
                    // onTouchStart={startTimer}
                  >
                    <PlayArrowIcon></PlayArrowIcon>
                  </RoundButton>
                ) : (
                  <RoundButtonRed
                    onClick={stopTimer}
                    // onTouchStart={stopTimer}
                  >
                    <Stop></Stop>
                  </RoundButtonRed>
                )}
              </Box>
            </Box>
          )}
        </Card>
      </Popover>
      {/* </Draggable> */}
    </Box>
  );
}
