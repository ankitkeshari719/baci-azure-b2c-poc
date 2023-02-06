import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import LandingImage from '../assets/img/landingimage.png';
import BACILogo from '../assets/img/bacilogo.png';
import commomStyles from './../style.module.scss';
import commonStyles from './../style.module.scss';
import gif from '../assets/img/participant_waiting.gif';
import useLoadRetro from '../hooks/useLoadRetro';
import StartRetroButton from '../elements/StartRetroButton';
import Toolbar from '../elements/Toolbar';
import { GlobalContext } from '../contexts/GlobalContext';
import theme from '../theme/theme';

const styles = {
  group90: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // margin: '112px 645px 362px 644px',
  },
};

export function ParticipantWaitingPage() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroName, setRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );
  const [animateFirst, setAnimateFirst] = React.useState(false);
  const [animatesecond, setAnimatesecond] = React.useState(false);
  const [animateThird, setAnimateThird] = React.useState(false);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  useLoadRetro();
  React.useEffect(() => {
    let interval1 = setInterval(() => {
      setAnimateFirst(false);
      setAnimatesecond(true);
      setAnimateThird(false);
    }, 10000);

    let interval2 = setInterval(() => {
      setAnimateFirst(false);
      setAnimatesecond(false);
      setAnimateThird(true);
    }, 10000);
    let interval3 = setInterval(() => {
      setAnimateFirst(true);
      setAnimatesecond(false);
      setAnimateThird(false);
    }, 10000);
  });
  return (
    <Grid container>
      <Grid xs={12} item>
        <Toolbar />
      </Grid>

      <Box
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          // margin: '112px 645px 362px 644px',
        }}
      >
        <Typography
          variant={isXsUp ? 'h4' : 'h2'}
          color={commonStyles.primaryDark}
          className="alignCenter"
          mb="8px"
        >
          Welcome to ‘{global?.currentRetro?.name}’ !
        </Typography>
        <Typography
          color={commonStyles.primaryDark}
          className="alignCenter"
          variant={isXsUp ? 'h6' : 'h4'}
          mb="52px"
        >
          Let’s go over last 2 weeks
        </Typography>
        <Typography
          color={commonStyles.secondaryMain}
          className="alignCenter"
          variant={isXsUp ? 'h6' : 'h4'}
          mb="32px"
        >
          Relax while facilitator starts the retro...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img width={isXsUp ? '280px' : '500px'} src={gif}></img>
        </Box>
        {animateFirst && !isXsUp && (
          <Box
            mt="16px"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <h4
              style={{ color: commomStyles.primaryDark, marginRight: '86px' }}
            >
              What went well
            </h4>
            <h4
              style={{
                color: commomStyles.primaryDark,
                opacity: '0.1',
                marginRight: '86px',
              }}
            >
              What didn't went well
            </h4>
            <h4 style={{ color: commomStyles.primaryDark, opacity: '0.5' }}>
              Actions
            </h4>
          </Box>
        )}
        {animatesecond && !isXsUp && (
          <Box
            mt="16px"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <h4
              style={{
                color: commomStyles.primaryDark,
                marginRight: '86px',
                opacity: '0.5',
              }}
            >
              What went well
            </h4>
            <h4
              style={{ color: commomStyles.primaryDark, marginRight: '86px' }}
            >
              What didn't went well
            </h4>
            <h4 style={{ color: commomStyles.primaryDark, opacity: '0.1' }}>
              Actions
            </h4>
          </Box>
        )}
        {animateThird && !isXsUp && (
          <Box
            mt="16px"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <h4
              style={{
                color: commomStyles.primaryDark,
                marginRight: '86px',
                opacity: '0.1',
              }}
            >
              What went well
            </h4>
            <h4
              style={{
                color: commomStyles.primaryDark,
                opacity: '0.5',
                marginRight: '86px',
              }}
            >
              What didn't went well
            </h4>
            <h4 style={{ color: commomStyles.primaryDark }}>Actions</h4>
          </Box>
        )}
      </Box>
      <StartRetroButton></StartRetroButton>
    </Grid>
  );
}
