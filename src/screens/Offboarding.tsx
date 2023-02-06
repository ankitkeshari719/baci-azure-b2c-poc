import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  Link,
  Slide,
  Slider,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { FEATURE_FLAGS } from '../constants';
import React from 'react';
//import { addFeedback } from '../firebase/firestore';
import { addFeedback } from '../msal/services';
import commonStyles from './../style.module.scss';
import './../global.scss';
import   successAnimation  from './../assets/img/success-animation.gif'
import { useNavigate } from 'react-router-dom';
import Toolbar from '../elements/Toolbar';
import theme from '../theme/theme';

export function Offboarding() {
  const [global, dispatch] = useContext(GlobalContext);
  const [rating, setRating] = useState(-1);
  const [comments, setComments] = useState('');
  const [done, setDone] = useState(!FEATURE_FLAGS.rateApp);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const navigate = useNavigate();

  const endOffboarding = () => {
    dispatch({ type: ActionType.CLOSE_CURRENT_RETRO });
    navigate('/');
  };

  const submitFeedback = async () => {
    if (rating !== -1 || comments !== '') {
      await addFeedback(
        global.currentRetro?.id as string,
        global.user,
        rating,
        comments
      );
    }
    if (global.currentRetro?.creatorId === global.user.id) {
      navigate('/report/' + global.currentRetro.id);
      return;
    }
    setDone(true);
  };

  return (
    <>
      <Box>
        <Toolbar />
      </Box>
      <CssBaseline />
      <Slide direction="up" in={!done} key="rate">
        <Box
          sx={{
            display: !done ? 'flex' : 'none',
            height: 'var(--app-height)',
            padding: '60px',
            overflowY: 'scroll',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '18px',
              color: 'white',
              background: '#695F9B',
              width: '100%',
              padding: '10px',
            }}
          >
            Please rate the app, so we can improve
          </Typography>
          <Divider sx={{ margin: '20px' }}></Divider>
          <FormControl sx={{ flexDirection: 'column', display: 'flex' }}>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              Do you like the BACI app?
            </Typography>
            <Box
              sx={{
                flexDirection: 'row',
                display: 'flex',
                gap: '20px',
                padding: '20px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={1} />
                {[1, 2, 3, 4, 5].map(i => (
                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                    xs={2}
                  >
                    <Button
                      sx={{ color: '#FCB34C', padding: 0 }}
                      onClick={() => setRating(i)}
                      // onTouchStart={() => setRating(i)}
                    >
                      {i > rating ? (
                        <EmojiEventsOutlinedIcon sx={{ fontSize: 40 }} />
                      ) : (
                        <EmojiEventsIcon sx={{ fontSize: 40 }} />
                      )}
                    </Button>
                  </Grid>
                ))}
                <Grid item xs={1} />
              </Grid>
            </Box>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              Any final comments?
            </Typography>
            <TextField
              variant="outlined"
              value={comments}
              sx={{ fontSize: '20px' }}
              onChange={e => setComments(e.currentTarget.value)}
              multiline
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  submitFeedback();
                }
              }}
            />
          </FormControl>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#159ADD',
                color: '#fff',
                minWidth: '300px',
              }}
              onClick={() => submitFeedback()}
              // onTouchStart={() => submitFeedback()}
            >
              Submit
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              marginTop: '20px',
            }}
          >
            <Link
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                color: '#727D84',
                textDecorationColor: '#727D84',
                fontSize: '0.9rem',
              }}
              onClick={() => setDone(true)}
              // onTouchStart={() => setDone(true)}
            >
              Skip
            </Link>
          </Box>
        </Box>
      </Slide>
      <Slide direction="up" in={done} key="thank-you">
        <Box sx={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box mt="40px"><img src={successAnimation} style={{width: '300px', height: '300px'}}></img></Box>
            <Box mt="40px" className='alignCenter'>
              <Typography variant="h4" color={commonStyles.PrimaryMain}>
                Your feedback is submitted successfully!
              </Typography>
            </Box>
            <Box mt="52px">
              <Button
                variant="outlined"
                className="secondaryButton"
                onClick={() => navigate('/board/' + global.currentRetro?.id)}
                // onTouchStart={() => navigate('/board/' + global.currentRetro?.id)}
              >
                <span className="secondaryButtonText">Review board</span>
              </Button>
            </Box>
            <Box mt="40px" sx={{ display: isXsUp ? 'block' :'inline-flex' }} className='alignCenter'>
              <Typography variant={isXsUp ? 'h3': 'h1'} color={commonStyles.secondaryMain}>
                Thank You for using{' '}
              </Typography>
              <Typography
                mr="10px"
                ml="10px"
                variant={isXsUp ? 'h3': 'h1'}
                color={commonStyles.PrimaryMain}
              >
                BACI
              </Typography>
              <Typography variant={isXsUp ? 'h3': 'h1'} color={commonStyles.secondaryMain}>
                Retros
              </Typography>
            </Box>
          </Box>
        </Box>
      
      </Slide>
    </>
  );
}
