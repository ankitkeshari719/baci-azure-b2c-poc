import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  QUICK_PULSE_CHECK_QUESTIONS,
  QUICK_PULSE_CHECK_QUESTIONS_INFO,
} from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import * as Icons from 'heroicons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import useLoadRetro from '../hooks/useLoadRetro';
import theme from '../theme/theme';
import { ConfirmContext } from '../contexts/ConfirmContext';
import commonStyles from './../style.module.scss';
import './../global.scss';
import Bluepulse from '../assets/img/bluepulse.png';
import Greypulse from '../assets/img/greypulse.png';
import happy from '../assets/img/happy.png';
import sad from '../assets/img/sad.png';
import neutral from '../assets/img/neutral.png';
import happyMask from '../assets/img/Happy_Mask.png';
import sadMask from '../assets/img/sad_mask.png';
import neutralMask from '../assets/img/Neutral_Mask.png';
import Toolbar from '../elements/Toolbar';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}>
    {props.children}
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: '14px',
  },
}));

export default function PulseCheck() {
  const navigate = useNavigate();
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [{ user, currentRetro }, dispatch] = React.useContext(GlobalContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);
  const {
    state: { fullPulseCheck, users },
    commitAction,
  } = React.useContext(BoardContext);

  const [showBlankErrors, setShowBlankErrors] = React.useState(false);
  const qs = QUICK_PULSE_CHECK_QUESTIONS.map(q => React.useState(-1));
  const [qsTooltipOpen, setQsTooltipOpen] = React.useState(-1);
  const [introScreen, setIntroScreen] = React.useState<boolean>(true);
  const [scrollDownButton, setScrollDownButton] = React.useState(true);
  const [showSharePanel, setShowSharePanel] = React.useState(false);
  const [pulse1, setPulse1] = React.useState(false);
  const [pulse2, setPulse2] = React.useState(false);
  const [pulse3, setPulse3] = React.useState(false);
  const [openHelpPopup, SetOpenHelpPopup] = React.useState(false);
  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const [popupTitle, setPopupTitle] = React.useState('');
  const [popupContent, setPopupContent] = React.useState('');
  useLoadRetro();

  React.useEffect(() => {
    if (
      users.length > 0 &&
      user != undefined &&
      user.id != undefined &&
      user.id != ''
    ) {
      const currentUser: any = users.find(user1 => user1.userId === user.id);
      // console.log("current user",currentUser.pulseCheckQuestions.length>0)
      if (currentUser?.pulseCheckQuestions.length > 0) {
        navigate('/board/' + currentRetro?.id);
        dispatch({
          type: ActionType.SET_SNACK_MESSAGE,
          payload: {
            snackMessage: {
              snackMessageType: 'warning',
              message: 'You have already submitted the pulse check feedback.',
            },
          },
        });
        return;
      }
    }

    const gPulseCheckState = sessionStorage.getItem('pulseCheckState');
    if (gPulseCheckState) {
      const parseGPulseCheckState = JSON.parse(gPulseCheckState);
      if (
        parseGPulseCheckState &&
        parseGPulseCheckState.pulseSubmitState &&
        parseGPulseCheckState?.retroId === currentRetro?.id
      ) {
        // console.log('already pulse checked');

        navigate('/board/' + currentRetro?.id);
        dispatch({
          type: ActionType.SET_SNACK_MESSAGE,
          payload: {
            snackMessage: {
              snackMessageType: 'warning',
              message: 'You have already submitted the pulse check feedback.',
            },
          },
        });
      }
      return;
    }
  }, [users, user?.id && user?.id != '']);

  React.useEffect(() => {
    qs.forEach(s => {
      s[1](-1);
    });
  }, [fullPulseCheck]);

  React.useEffect(() => {
    onScroll();
  });

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user.id,
    });
  };

  function setPulseBar(value: any) {
    // console.log(qs, value);
    if ((value === 0 && pulse1 == false) || qs[value][0] !== -1) {
      setPulse1(true);
    } else if ((value = (1 && pulse2 == false) || qs[value][0] !== -1)) {
      setPulse2(true);
    } else if ((value = (2 && pulse3 == false) || qs[value][0] !== -1)) {
      setPulse3(true);
    }
  }

  const fullCheckSwitch = () => {
    if (!fullPulseCheck) {
      setConfirmAction({
        title: 'Full Pulse Check',
        text: 'This action will enable Full Pulse Check (7 questions) for All Retro Participants.',
        action: 'Switch',
        onConfirm: async () => {
          await saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
            creatorId: currentRetro?.creatorId,
            userId: user.id,
            fullPulseCheck: true,
          });
          setConfirmAction(undefined);
        },
      });
    } else {
      setConfirmAction({
        title: 'Quick Pulse Check',
        text: 'This action will switch All Retro Participants to Quick Pulse Check (3 questions).',
        action: 'Switch',
        onConfirm: async () => {
          await saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
            fullPulseCheck: false,
            creatorId: currentRetro?.creatorId,
            userId: user.id,
          });
          setConfirmAction(undefined);
        },
      });
    }
  };

  const scrollDown = () => {
    scrollableRef.current?.scroll(0, scrollableRef.current?.scrollHeight);
  };

  const onScroll = () => {
    if (scrollableRef.current) {
      setScrollDownButton(
        scrollableRef.current.scrollHeight - 10 >
          scrollableRef.current.scrollTop + scrollableRef.current?.clientHeight
      );
    }
  };

  const handleClose = () => {
    SetOpenHelpPopup(false);
  };

  function setPopupData(index: any) {
    setPopupTitle(QUICK_PULSE_CHECK_QUESTIONS[index]);
    setPopupContent(QUICK_PULSE_CHECK_QUESTIONS_INFO[index]);
  }

  const submit = () => {
    const someBlank =
      qs.findIndex(q => q[0] === -1) !== -1 &&
      qs.findIndex(q => q[0] === -1) < QUICK_PULSE_CHECK_QUESTIONS.length;
    // console.log('pulse check array', qs);
    const submitter = async () => {
      // Submit
      await saveAndProcessAction(BoardActionType.SUBMIT_PULSE_CHECK, {
        questions: qs.map((q, i) => ({ id: String(i), entry: q[0] })),
      });
      setConfirmAction(undefined);
      dispatch({
        type: ActionType.SET_SNACK_MESSAGE,
        payload: {
          snackMessage: {
            message:
              'Your responses have been successfully submitted. Thank you!',
            snackMessageType: 'success',
          },
        },
      });
      const pulseCheckState = {
        retroId: currentRetro?.id + '',
        pulseSubmitState: true,
      };
      sessionStorage.setItem(
        'pulseCheckState',
        JSON.stringify(pulseCheckState)
      );
      navigate('/board/' + currentRetro?.id);
    };

    if (someBlank) {
      setShowBlankErrors(true);
      setConfirmAction({
        title: 'Submit',
        text: 'Some questions are blank, are you sure you want to submit?',
        action: 'Submit',
        onConfirm: submitter,
      });
    } else {
      submitter();
    }
  };

  const skip = () => {
    setConfirmAction({
      title: 'Skip Pulse Check',
      text: 'Are you sure? Your voice matters!',
      action: 'Skip',
      onConfirm: () => {
        navigate('/board/' + currentRetro?.id);
        setConfirmAction(undefined);
      },
    });
  };

  return (
    <Grid xs={12} container item>
      {/* Toolbar Section */}
      <Grid xs={12} item>
        <Toolbar />
      </Grid>
      {/* Main content Section */}
      <Grid
        item
        pr={isXsUp ? '0px' : commonStyles.m_80}
        pl={isXsUp ? '0px' : commonStyles.m_80}
        xs={12}
        lg={12}
        sx={{
          overflowY: isXsUp ? 'scroll' : 'auto',
          height: isXsUp ? 'calc(80vh)' : 'calc(90vh)',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            userSelect: 'none',
            background: 'white',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Typography
            variant={isXsUp ? 'h6' : 'h4'}
            sx={{
              fontSize: '20px',
              marginBottom: isXsUp ? '20px' : '40px',
              padding: '20px',
              marginTop: '48px',
            }}
            className="alignCenter"
          >
            Let's start with a quick Pulse Check to see how you are feeling
          </Typography>
          <Typography
            fontSize="14px"
            color={commonStyles.secondaryMain}
            className="alignCenter"
          >
            Your identity will be confidential
          </Typography>
        </Box>
        {/* Mobile handling Section */}
        {!isXsUp && (
          <Box mt="48px" sx={{ display: 'flex', justifyContent: 'center' }}>
            <span className={pulse1 ? 'pulseLineBlue' : 'pulseLineGrey'}></span>
            <img src={pulse1 ? Bluepulse : Greypulse}></img>
            <span className={pulse2 ? 'pulseLineBlue' : 'pulseLineGrey'}></span>
            <img src={pulse2 ? Bluepulse : Greypulse}></img>
            <span className={pulse3 ? 'pulseLineBlue' : 'pulseLineGrey'}></span>
            <img src={pulse3 ? Bluepulse : Greypulse}></img>
            <span className={pulse3 ? 'pulseLineBlue' : 'pulseLineGrey'}></span>
          </Box>
        )}
        {/* QUICK PULSE CHECK QUESTIONS Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: isXsUp ? 'column' : 'row',
          }}
        >
          {QUICK_PULSE_CHECK_QUESTIONS.map((question, index) => (
            <Grid
              item
              xs={8}
              lg={4}
              sx={{ display: 'flex', justifyContent: 'center' }}
              key={index}
            >
              <Box
                sx={{
                  marginTop: isXsUp ? '0px' : '48px',
                }}
              >
                <Typography
                  variant={isXsUp ? 'h6' : 'h5'}
                  sx={{
                    marginBottom: isXsUp ? '0px' : '40px',
                    padding: '20px',
                    marginTop: isXsUp ? '0px' : '100px',
                  }}
                >
                  {question}
                  {isXsUp ? (
                    <Icons.QuestionMarkCircleOutline
                      size={20}
                      color={commonStyles.secondaryMain}
                      style={{
                        marginBottom: '-5px',
                        marginLeft: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        SetOpenHelpPopup(true);
                        setPopupData(index);
                      }}
                    />
                  ) : (
                    <Tooltip
                      placement="top"
                      title={QUICK_PULSE_CHECK_QUESTIONS_INFO[index]}
                    >
                      <Icons.QuestionMarkCircleOutline
                        size={20}
                        color={commonStyles.secondaryMain}
                        style={{ marginBottom: '-5px', marginLeft: '5px' }}
                      />
                    </Tooltip>
                  )}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    marginTop: isXsUp ? '0px' : '48px',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: !isXsUp ? '64px' : '52px',
                      height: !isXsUp ? '64px' : '52px',
                    }}
                  >
                    <Box
                      style={{
                        backgroundImage: 'url(' + sad + ')',
                        width: '40px',
                        height: '40px',
                      }}
                      onClick={() => {
                        qs[index][1](1);
                        setPulseBar(index);
                      }}
                      // onTouchStart={() => {
                      //   qs[index][1](1);
                      //   setPulseBar(index);
                      // }}
                    ></Box>
                    <img
                      src={sadMask}
                      style={{
                        marginLeft: !isXsUp ? '-10px' : '-6px',
                        marginTop: !isXsUp ? '-50px' : '-45px',
                        width: !isXsUp ? '64px' : '52px',
                        height: !isXsUp ? '64px' : '52px',
                        display: qs[index][0] === 1 ? 'block' : 'none',
                      }}
                    ></img>
                  </Box>
                  <Box
                    sx={{
                      width: !isXsUp ? '64px' : '52px',
                      height: !isXsUp ? '64px' : '52px',
                    }}
                  >
                    <Box
                      style={{
                        backgroundImage: 'url(' + neutral + ')',
                        width: '40px',
                        height: '40px',
                        marginRight: '32px',
                      }}
                      // onTouchStart={() => {
                      //   qs[index][1](2);
                      //   setPulseBar(index);
                      // }}
                      onClick={() => {
                        qs[index][1](2);
                        setPulseBar(index);
                      }}
                    ></Box>
                    <img
                      src={neutralMask}
                      style={{
                        marginLeft: !isXsUp ? '-10px' : '-6px',
                        marginTop: !isXsUp ? '-50px' : '-45px',
                        width: !isXsUp ? '64px' : '52px',
                        height: !isXsUp ? '64px' : '52px',
                        display: qs[index][0] === 2 ? 'block' : 'none',
                      }}
                    ></img>
                  </Box>
                  <Box
                    sx={{
                      width: !isXsUp ? '64px' : '52px',
                      height: !isXsUp ? '64px' : '52px',
                    }}
                  >
                    <Box
                      style={{
                        backgroundImage: 'url(' + happy + ')',
                        width: '40px',
                        height: '40px',
                      }}
                      // onTouchStart={() => {
                      //   qs[index][1](3);
                      //   setPulseBar(index);
                      // }}
                      onClick={() => {
                        qs[index][1](3);
                        setPulseBar(index);
                      }}
                    ></Box>
                    <img
                      src={happyMask}
                      style={{
                        marginLeft: !isXsUp ? '-10px' : '-6px',
                        marginTop: !isXsUp ? '-50px' : '-45px',
                        width: isXsUp ? '52px' : '64px',
                        height: isXsUp ? '52px' : '64px',
                        display: qs[index][0] === 3 ? 'block' : 'none',
                      }}
                    ></img>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Box>
        {/* Submit and go to retro button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
            marginTop: isXsUp ? '0px' : '100px',
          }}
        >
          <Button
            variant="outlined"
            className="secondaryButton"
            onClick={submit}
            // onTouchStart={submit}
          >
            <span className="secondaryButtonText">Submit and go to retro</span>
          </Button>
        </Box>
        {/* Skip Pulse Check button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: !isXsUp ? '20px' : '0px',
            cursor: 'pointer',
          }}
        >
          <Link sx={{ marginTop: '43px' }} className="infoLink" onClick={skip}>
            Skip Pulse Check
          </Link>
        </Box>
        <Dialog open={openHelpPopup} onClose={handleClose}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography
              variant="h6"
              mt="40px"
              color={commonStyles.secondaryMain}
            >
              {popupTitle}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container justifyContent="center">
              <Typography
                variant="h5"
                color={commonStyles.grey60}
                mt="20px"
                mb="20px"
              >
                {popupContent}
              </Typography>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className="secondaryButton"
              onClick={handleClose}
              sx={{ marginBottom: '40px', width: '100%' }}
            >
              <span className="secondaryButtonText">close</span>
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}
