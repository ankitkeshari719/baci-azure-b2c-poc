import { Button, Paper, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import theme from '../theme/theme';

const FirstTimeExperience = (props: any) => {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [showManual, setShowManual] = React.useState(
    sessionStorage.getItem('showManual')
  );
  // const [isXsUp, setXsUp] = React.useState(props.isXsUp);
  React.useEffect(() => {
    if (
      showManual == undefined ||
      (showManual == null && props.facilitator == true)
    ) {
      showPublishInfo();
    } else if (showManual == '1') {
      showFinishInfo();
    }

    //
  }, [showManual && props.facilitator == true]);
  React.useEffect(() => {
    if (showManual == undefined || showManual == null || showManual == '1') {
      if (props.facilitator === false) showLeaveInfo();
    }

    //
  }, [isXsUp, showManual && props.facilitator == false]);

  const doneWithManual = () => {
    setShowManual('2');
    sessionStorage.setItem('showManual', '2');
  };

  const showPublishInfo = () => {
    let elem = document.getElementById('publish0');
    if (elem != null && elem != undefined) {
      var d = document.getElementById('publishDiv');
      var publishPaper = document.getElementById('publishPaper');
      var finishRetroPaper = document.getElementById('finishRetroPaper');
      if (finishRetroPaper != undefined && finishRetroPaper != null)
        finishRetroPaper.style.display = 'none';
      if (d != null && d !== undefined) {
        d.style.position = 'absolute';

        d.style.width = elem.getBoundingClientRect().width + 10 + 'px';
        d.style.height = elem.getBoundingClientRect().width + 10 + 'px';
        d.style.padding = '10px';

        d.style.left =
          elem.getBoundingClientRect().x -
          elem.getBoundingClientRect().width / 2 +
          5 +
          'px';
        d.style.top =
          elem.getBoundingClientRect().y -
          elem.getBoundingClientRect().width / 2 -
          5 +
          'px';
        if (publishPaper != null && publishPaper != undefined) {
          publishPaper.style.display = 'flex';
          publishPaper.style.top =
            elem.getBoundingClientRect().y +
            elem.getBoundingClientRect().width / 2 +
            'px';
          publishPaper.style.left =
            elem.getBoundingClientRect().x +
            elem.getBoundingClientRect().width +
            'px';
        }
      }
    }
  };

  const showLeaveInfo = () => {
    let publishPaper = document.getElementById('publishPaper');
    if (publishPaper !== undefined && publishPaper !== null)
      publishPaper.style.display = 'none';
    let id = 'leaveRetro';
    if (isXsUp) {
      id = 'leaveRetroIsXsUp';
    } else {
      id = 'leaveRetro';
    }
    let leaveRetro = document.getElementById(id);
    if (leaveRetro != null && leaveRetro != undefined) {
      var d = document.getElementById('publishDiv');
      var leaveRetroPaper = document.getElementById('leaveRetroPaper');
      if (d != null && d !== undefined) {
        d.style.position = 'absolute';

        d.style.left = leaveRetro.getBoundingClientRect().x - 10 + 'px';
        d.style.top =
          leaveRetro.getBoundingClientRect().y -
          leaveRetro.getBoundingClientRect().width / 2 +
          'px';
        d.style.width = leaveRetro.getBoundingClientRect().width + 'px';
        d.style.height = leaveRetro.getBoundingClientRect().width + 'px';
        d.style.padding = '10px';
        if (leaveRetroPaper != null && leaveRetroPaper != undefined) {
          leaveRetroPaper.style.display = 'flex';
          leaveRetroPaper.style.top = isXsUp
            ? leaveRetro.getBoundingClientRect().y +
              leaveRetro.getBoundingClientRect().width / 1.5 +
              'px'
            : leaveRetro.getBoundingClientRect().y +
              leaveRetro.getBoundingClientRect().width / 2 +
              'px';
          leaveRetroPaper.style.left = isXsUp
            ? leaveRetro.getBoundingClientRect().x -
              leaveRetroPaper.getBoundingClientRect().width / 1.5 +
              10 +
              'px'
            : leaveRetro.getBoundingClientRect().x -
              leaveRetroPaper.getBoundingClientRect().width +
              10 +
              'px';
        }
      }
    }
  };

  const showFinishInfo = () => {
    sessionStorage.setItem('showManual', '1');
    let elem = document.getElementById('publish0');
    let publishPaper = document.getElementById('publishPaper');
    if (publishPaper !== undefined && publishPaper !== null)
      publishPaper.style.display = 'none';
    let finishRetro = document.getElementById('finishRetro');
    if (finishRetro != null && elem != undefined) {
      var d = document.getElementById('publishDiv');
      var finishRetroPaper = document.getElementById('finishRetroPaper');
      if (d != null && d !== undefined) {
        d.style.position = 'absolute';

        d.style.left = finishRetro.getBoundingClientRect().x - 10 + 'px';
        d.style.top =
          finishRetro.getBoundingClientRect().y -
          finishRetro.getBoundingClientRect().width / 2 +
          'px';
        d.style.width = finishRetro.getBoundingClientRect().width + 'px';
        d.style.height = finishRetro.getBoundingClientRect().width + 'px';
        d.style.padding = '10px';
        if (finishRetroPaper != null && finishRetroPaper != undefined) {
          finishRetroPaper.style.display = 'flex';
          finishRetroPaper.style.top =
            finishRetro.getBoundingClientRect().y +
            finishRetro.getBoundingClientRect().width / 2 +
            'px';
          finishRetroPaper.style.left =
            finishRetro.getBoundingClientRect().x -
            finishRetroPaper.getBoundingClientRect().width +
            10 +
            'px';
        }
      }
    }
  };

  return (
    <div>
      {showManual != '2' && (
        <>
          <Box
            sx={{
              zIndex: '10000',
              position: 'absolute',
              width: '100%',
              display: 'flex',
              height: '100vh',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'gray',
              opacity: 0.2,
            }}
          >
            <div
              id="publishDiv"
              style={{
                background: 'antiquewhite',
                borderRadius: '50%',
                border: '2px solid white',
              }}
            ></div>
          </Box>

          <Paper
            id="publishPaper"
            sx={{
              width: '434px',
              height: '258px',
              zIndex: '100001',
              position: 'absolute',
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              color: '#EE7538',
              fontSize: '16px',
              padding: '15px',
            }}
            elevation={3}
          >
            <Typography pl="47" pr="47">
              1/2
            </Typography>
            <Typography align="center" pl="47" pr="47">
              Participants see their own cards only until you click ‘Publish’.
              Participants will then see all cards, grouping and will be able to
              vote
            </Typography>
            <Box sx={{ display: 'flex', flexDiection: 'row', width: '80%' }}>
              <Box sx={{ display: 'flex', width: '35%' }}></Box>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '65%',
                  alignItems: 'center',
                  height: '40px',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    padding: '10px 20px',
                    borderRadius: '24px',
                    fontSize: '16px',
                    width: '100px',
                  }}
                  onClick={showFinishInfo}
                  // onTouchStart={showFinishInfo}
                >
                  Next
                </Button>
                <Typography
                  sx={{
                    color: '#4285F4',
                    textDecorationLine: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={doneWithManual}
                  // onTouchStart={doneWithManual}
                >
                  Skip Intro
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            id="finishRetroPaper"
            sx={{
              width: '434px',
              height: '258px',
              zIndex: '100001',
              position: 'absolute',
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              color: '#EE7538',
              fontSize: '16px',
              padding: '15px',
            }}
            elevation={3}
          >
            <Typography pl="47" pr="47">
              2/2
            </Typography>
            <Typography align="center" pl="47" pr="47">
              Hit "FINISH RETRO" at the end of the session to access Retro
              Summary. All Participants will see Feedback questions
            </Typography>
            <Box sx={{ display: 'flex', flexDiection: 'row', width: '80%' }}>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '65%',
                  alignItems: 'center',
                  height: '40px',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{
                    color: '#4285F4',
                    textDecorationLine: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={showPublishInfo}
                  // onTouchStart={showPublishInfo}
                >
                  Back
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    padding: '10px 20px',
                    borderRadius: '24px',
                    fontSize: '16px',
                    width: '100px',
                  }}
                  onClick={doneWithManual}
                  // onTouchStart={doneWithManual}
                >
                  Done
                </Button>
              </Box>
              <Box sx={{ display: 'flex', width: '35%' }}></Box>
            </Box>
          </Paper>

          <Paper
            id="leaveRetroPaper"
            sx={{
              width: isXsUp ? '70%' : '350px',
              height: '208px',
              zIndex: '100001',
              position: 'absolute',
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              color: '#EE7538',
              fontSize: '16px',
              padding: '15px',
            }}
            elevation={3}
          >
            <Typography
              pl="47"
              pr="47"
              fontSize="18px"
              fontWeight="600"
              align="center"
            >
              Hit ‘Leave Retro’ once you are DONE!
            </Typography>
            <Typography align="center" pl="47" pr="47">
              You would be asked to submit the feedback
            </Typography>

            <Button
              variant="contained"
              sx={{
                padding: '10px 20px',
                borderRadius: '24px',
                fontSize: '16px',
                width: '100px',
              }}
              onClick={doneWithManual}
              // onTouchStart={doneWithManual}
            >
              GOT IT
            </Button>
          </Paper>
        </>
      )}
    </div>
  );
};

export default FirstTimeExperience;
