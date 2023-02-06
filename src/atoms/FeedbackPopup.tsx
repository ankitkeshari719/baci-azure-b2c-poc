import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  FEATURE_FLAGS,
  FEEDBACK_QUESTIONS,
  FEEDBACK_QUESTIONS_COLORS,
  FEEDBACK_QUESTIONS_FILLED,
  FEEDBACK_QUESTIONS_OUTLINE,
} from '../constants';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import commonStyles from './../style.module.scss';
import './../global.scss';
import React from 'react';
import { display } from '@mui/system';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { BoardContext } from '../contexts/BoardContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { FeedbackEntry } from '../types';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { useNavigate } from 'react-router-dom';
import closeImage from '../assets/img/Vectorclose.png';
import theme from '../theme/theme';
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '6px',
  borderRadius: '4px',
  marginTop: '32px',

  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export default function FeedbackPopup(props: {
  show: boolean;
  showThankYou: boolean;
}) {
  React.useState(false);
  const [index, setIndex] = React.useState(0);
  const qs = FEEDBACK_QUESTIONS.map(q => React.useState(0));
  const { commitAction } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);
  const [isBarSet, setIsBarSet] = React.useState(true);
  const [barvalue, setbarvalue] = React.useState(0);
  const [showThankYou, setShowThankYou] = React.useState(false);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const navigate = useNavigate();

  const handleNext = () => {
    let newIndex = index + 1;
    setIndex(newIndex);
    setIsBarSet(true);
  };
  const handlePrevious = () => {
    let newIndex = index - 1;
    setIndex(newIndex);
    setIsBarSet(false);
  };
  function setFeedbackBar(index: number) {
    if (isBarSet && qs[index][0] === 0) {
      setbarvalue(barvalue + 100 / qs.length);
      setIsBarSet(false);
    }
  }
  React.useEffect(() => {
    setShowThankYou(props.showThankYou);
    if (props.showThankYou) {
      setTimeout(() => setShowThankYou(false), 5000);
    }
  }, []);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(
      actionName as BoardActionType,
      { parameters, userId: global.user.id },
      true
    );
  };
  const submitFeedback = async () => {
    await saveAndProcessAction(BoardActionType.SUBMIT_FEEDBACK, {
      feedback: qs.map(
        (q, i) =>
          ({
            id: '' + i,
            entry: '' + q[0],
          } as FeedbackEntry)
      ),
    });
    dispatch({
      type: ActionType.SET_SNACK_MESSAGE,
      payload: {
        snackMessage: {
          message: 'Your feedback has been successfully submitted. Thank you!',
          snackMessageType: 'success',
        },
      },
    });
    setConfirmAction(undefined);
    if (
      FEATURE_FLAGS.report &&
      global.currentRetro?.creatorId === global.user.id
    ) {
      navigate('/report/' + global.currentRetro.id);
    } else {
      navigate(`/offboarding`);
    }
  };
  const closeFeedback = () => {
    navigate(`/offboarding`);
  };
  return (
    <Dialog
      open={props.show}
      keepMounted
      PaperProps={{
        sx: {
          width: '800px',
          maxWidth: '800px',
          height: '400px',
          maxHeight: '400px',
          padding: isXsUp ? '19px' : '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'hidden',
        },
      }}
      sx={{
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
        borderRadius: '20px',
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end' }}
        mr="23px"
        mt="23px"
      >
        <img
          src={closeImage}
          onClick={closeFeedback}
          style={{
            position: 'absolute',
            right: '20px',
            top: '10px',
            cursor: 'pointer',
          }}
          //  onTouchStart={closeFeedback}
        ></img>
      </Box>
      {showThankYou ? (
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="/images/RetroFinish.gif"></img>
          <Typography
            color={commonStyles.secondaryMain}
            fontSize="24px"
            mt="15px"
          >
            The retro is finished!
          </Typography>
        </DialogContent>
      ) : (
        <>
          <DialogTitle
            mt="20px"
            variant={!isXsUp ? 'h3' : 'h5'}
            color={commonStyles.secondaryMain}
            textAlign="center"
            p="0px !important"
          >
            Please help facilitator with your feedback
          </DialogTitle>
          <Typography className="identityWillbeConfidentialText">
            Your identity will be confidential
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: !isXsUp ? '20px' : '10px'}}>
            <BorderLinearProgress
              variant="determinate"
              value={barvalue}
              style={{
                width: isXsUp ? '80%' : '600px',
              }}
            />
          </Box>

          <DialogContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              textAlign: 'center',
              overflowY: 'hidden',
              overflowX: 'hidden',
            }}
          >
            <Box sx={{display: 'flex', flexDirection : 'column', alignItems: 'center'}}>
              <Box>
                <Typography
                  variant={!isXsUp ? 'h4' : 'h5'}
                  mt={!isXsUp ? '32px' : '48px'}
                  height="56px"
                  id="alert-dialog-slide-description"
                >
                  {FEEDBACK_QUESTIONS[index]}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '216px',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: !isXsUp ? '5px' : '30px',
                }}
              >
                {[1, 2, 3, 4, 5].map(i => (
                  <Button
                    sx={{
                      color: FEEDBACK_QUESTIONS_COLORS[index],
                      minWidth: 0,
                     
                    }}
                    onClick={() => {
                      qs[index][1](i);
                      setFeedbackBar(index);
                    }}
                    // onTouchStart={() => qs[index][1](i)}
                  >
                    {i > qs[index][0]
                      ? FEEDBACK_QUESTIONS_OUTLINE[index]
                      : FEEDBACK_QUESTIONS_FILLED[index]}
                  </Button>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ width: '100%' }}>
            {!isXsUp ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent:(index >= 1 )? 'space-between' : 'flex-end',
                }}
                m="20px"
              >
                {index >= 1 && (
                  <Button className="popupPrevBtn" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
                {!(index === FEEDBACK_QUESTIONS_COLORS.length - 1) ? (
                  <Button className="popupNextBtn" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    className="submitfeedback"
                    onClick={submitFeedback}
                  >
                    <span className="secondaryButtonText">Submit Feedback</span>
                  </Button>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent:(index >= 1 )? 'space-between' : 'flex-end',
                  alignItems: 'center',
                  flexDirection: !(
                    index >= 1
                  ) 
                    ? 'row'
                    : 'row-reverse',
                }}
              >
                {!(index === FEEDBACK_QUESTIONS_COLORS.length - 1) ? (
                  <Button className="popupNextBtn" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    className="submitfeedback"
                    onClick={submitFeedback}
                    sx={{ marginBottom: '5px' }}
                  >
                    <span className="secondaryButtonText">Submit Feedback</span>
                  </Button>
                )}

                {index >= 1 && (
                  <Button className="popupPrevBtn" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
              </Box>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
