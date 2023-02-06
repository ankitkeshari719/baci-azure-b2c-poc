import { styled, useMediaQuery } from '@mui/material';
import React, { ReactElement } from 'react';
import { FEATURE_FLAGS, FEEDBACK_QUESTIONS } from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';

import { useNavigate } from 'react-router';
import theme from '../theme/theme';
import { FeedbackEntry } from '../types';

const ColumnComponent = styled('div')({
  height: 'calc(var(--app-height) - 120px)',
  display: 'flex',
  flexGrow: 1,
  padding: 0,
});

export function FeedbackColumn({
  noHeader,
  leftHeaderComponent,
  rightHeaderComponent,
}: {
  noHeader: boolean;
  leftHeaderComponent: any;
  rightHeaderComponent: any;
}): ReactElement {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const navigate = useNavigate();

  const [global, dispatch] = React.useContext(GlobalContext);
  const { commitAction } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [showBlankErrors, setShowBlankErrors] = React.useState(false);
  const [scrollDownButton, setScrollDownButton] = React.useState(true);

  const scrollableContainer = React.createRef<HTMLDivElement>();

  const qs = FEEDBACK_QUESTIONS.map(q => React.useState(0));

  const [uncompletedError, setUnCompletedError] = React.useState(false);

  const scrollContainer = isXsUp || !noHeader;

  React.useEffect(() => {
    onScroll();
  }, []);

  const scrollDown = () => {
    scrollableContainer.current?.scroll(
      0,
      scrollableContainer.current?.scrollHeight
    );
  };

  const onScroll = () => {
    if (scrollableContainer.current) {
      setScrollDownButton(
        scrollableContainer.current.scrollHeight - 10 >
          scrollableContainer.current.scrollTop +
            scrollableContainer.current?.clientHeight
      );
    }
  };

  const submit = () => {
    const submitter = async () => {
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
            message:
              'Your feedback has been successfully submitted. Thank you!',
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

    if (qs.some(q => q[0] === -1)) {
      setConfirmAction({
        title: 'Submit',
        text: 'Some questions are blank, are you sure you want to submit?',
        action: 'Submit',
        onConfirm: submitter,
      });
      setShowBlankErrors(true);
    } else {
      setUnCompletedError(false);
      setShowBlankErrors(false);
      submitter();
    }
  };

  const skip = () => {
    setConfirmAction({
      title: 'Skip Feedback',
      text: `Don't leave, please help your facilitator understand if this was a good session.`,
      action: 'Skip Feedback',
      onConfirm: () => {
        setConfirmAction(undefined);
        if (
          FEATURE_FLAGS.report &&
          global.currentRetro?.creatorId === global.user.id
        ) {
          navigate('/report/' + global.currentRetro.id);
        } else {
          navigate(`/offboarding`);
        }
      },
    });
  };

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

  return (
    <h1></h1>
    // <ColumnComponent
    //   sx={{
    //     height: isXsUp
    //       ? 'calc(var(--app-height) - 145px)'
    //       : 'calc(var(--app-height) - 95px)',
    //     maxWidth: '800px',
    //   }}
    // >
    //   <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    //     {!noHeader ? (
    //       <Typography
    //         align="center"
    //         sx={{ userSelect: 'none', display: 'flex', fontSize: '1rem' }}
    //       >
    //         {leftHeaderComponent}
    //         <Box
    //           sx={{
    //             position: 'initial',
    //             width: '100%',
    //             textTransform: 'uppercase',
    //             padding: '10px',
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //           }}
    //         >
    //           Feedback
    //         </Box>
    //         {rightHeaderComponent}
    //       </Typography>
    //     ) : null}

    //     <Box
    //       sx={{
    //         display: 'flex',
    //         padding: isXsUp ? 0 : '20px 60px',
    //         overflowY: 'scroll',
    //         flexDirection: 'column',
    //         justifyContent: 'flex-start',
    //         background: 'white',
    //         alignItems: 'center',
    //       }}
    //       ref={scrollableContainer}
    //       onScroll={onScroll}
    //     >

    //       <Grid container sx={{ justifyContent: 'center' }}>
    //         {FEEDBACK_QUESTIONS.map((question, index) => (
    //           <Grid
    //             item
    //             xs={scrollContainer ? 12 : 12}
    //             sx={{
    //               fontSize: '0.7rem',
    //               fontWeight: 'bold',
    //               background: 'none',
    //               padding: isXsUp ? '20px' : '20px 40px',
    //             }}
    //           >
    //             <Typography
    //               variant="h6"
    //               sx={{
    //                 fontSize: scrollContainer ? '1rem' : '18px',
    //                 textAlign: 'center',
    //               }}
    //             >
    //               {index + 1}/{FEEDBACK_QUESTIONS.length} <br />
    //               <span>{question}</span>
    //             </Typography>
    //             <div style={{ padding: '10px' }}>
    //               <Grid container spacing={2}>
    //                 <Grid item xs={1} />
    //                 {[1, 2, 3, 4, 5].map(i => (
    //                   <Grid
    //                     item
    //                     sx={{
    //                       display: 'flex',
    //                       justifyContent: 'center',
    //                       alignContent: 'center',
    //                     }}
    //                     xs={2}
    //                   >
    //                     <Button
    //                       sx={{
    //                         color: FEEDBACK_QUESTIONS_COLORS[index],
    //                         minWidth: 0,
    //                       }}
    //                       onClick={() => qs[index][1](i)}
    //                       onTouchStart={() => qs[index][1](i)}
    //                     >
    //                       {i > qs[index][0]
    //                         ? FEEDBACK_QUESTIONS_OUTLINE[index]
    //                         : FEEDBACK_QUESTIONS_FILLED[index]}
    //                     </Button>
    //                   </Grid>
    //                 ))}
    //                 <Grid item xs={1} />
    //               </Grid>
    //               {showBlankErrors && qs[index][0] === -1 ? (
    //                 <Typography
    //                   sx={{
    //                     fontSize: '0.7rem',
    //                     color: '#FCB34C',
    //                     fontWeight: 'bold',
    //                     textAlign: 'center',
    //                   }}
    //                 >
    //                   This question is blank
    //                 </Typography>
    //               ) : null}
    //             </div>
    //           </Grid>
    //         ))}
    //       </Grid>
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}
    //       >
    //         <Button
    //           variant="outlined"
    //           sx={{
    //             ':hover': { background: '#159ADD' },
    //             background: '#159ADD',
    //             color: '#fff',
    //             minWidth: '300px',
    //           }}
    //           onClick={submit}
    //         >
    //           Submit Feedback
    //         </Button>
    //         <Link
    //           sx={{
    //             textAlign: 'center',
    //             cursor: 'pointer',
    //             marginTop: '20px',
    //             color: '#727D84',
    //             textDecorationColor: '#727D84',
    //             fontSize: '0.9rem',
    //           }}
    //           onClick={skip}
    //           onTouchStart={skip}
    //         >
    //           Skip Feedback
    //         </Link>
    //       </Box>
    //       {scrollDownButton ? (
    //         <div
    //           style={{
    //             opacity: scrollDownButton ? 1 : 0,
    //             transition: 'opacity 300ms',
    //             position: 'fixed',
    //             bottom: 0,
    //             left: 0,
    //             right: 0,
    //             height: '50px',
    //             minWidth: '100vw',
    //             display: 'flex',
    //             alignContent: 'center',
    //             justifyContent: 'center',
    //             background: 'white',
    //           }}
    //         >
    //           <Button onClick={e => scrollDown()} style={{ minHeight: '30px' }}>
    //             <KeyboardArrowDownIcon />
    //           </Button>
    //         </div>
    //       ) : null}
    //     </Box>
    //   </div>
    // </ColumnComponent>
  );
}
