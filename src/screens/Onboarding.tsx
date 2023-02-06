import * as React from 'react';

import {
  Button,
  createMuiTheme,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  MenuItem,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailShareButton } from 'react-share';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import EmailIcon from '@mui/icons-material/Email';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import QRCode from 'qrcode.react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRetro } from '../helpers';
import { Retro as RetroType } from '../types';
import { useAzureAuth } from '../msal/azureauth';
import { BoardContext } from '../contexts/BoardContext';

export function Onboarding() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const retro = useRetro();
  const { state: commitAction } = React.useContext(BoardContext);
  const [started, setStarted] = useState(global.retroCreateState || false);
  const [joining, setJoining] = useState(id ? true : false);
  const [captureName, setCaptureName] = useState(id ? true : false);
  const [isTimeFrameSet, setisTimeFrameSet] = useState(id ? true : false);
  const [humanId, setHumanId] = useState(id || '');
  const [retroName, setRetroName] = useState('');
  const [localRetroName, setlocalRetroName] = useState(
    global?.currentRetro?.name || ''
  );
  const [retroTimeframe, setRetroTimeframe] = useState('');
  const [userName, setUserName] = useState(
    global.preferredNickname || global.user?.name
  );
  const [codeError, setCodeError] = useState('');
  const [codeWarning, setCodeWarning] = useState('');
  const timeframeRef = React.useRef<HTMLSelectElement | null>(null);

  const AVATAR_CHARACTER_LIMIT = 30;
  const RETRONAME_CHARACTER_LIMIT = 80;
  React.useEffect(() => {
    if (window.location.pathname.includes('join')) {
      setStarted(false);
      if (sessionStorage.getItem('BoardContext') !== null) {
        let data: any = sessionStorage.getItem('BoardContext');
        data = JSON.parse(data);
        for (const item of [...data.history]) {
          setRetroName(item.action.parameters.retroName);
        }
      }
    }
  }, []);
  const create = async () => {
    sessionStorage.setItem('retroname', retroName);
    setlocalRetroName('"' + retroName + '"');
    if (retroName !== '' && retroTimeframe !== '') {
      setCodeError('');
      setisTimeFrameSet(false);
      await retro.create({ name: retroName }, retroTimeframe, '');
    } else if (retroTimeframe === '' && retroName === '') {
      setisTimeFrameSet(true);
      setCodeError('Please enter retro name');
    } else if (retroName === '') {
      setCodeError('Please enter retro name');
    } else if (retroTimeframe === '') {
      setisTimeFrameSet(true);
    }
    sessionStorage.setItem('retroname', '"' + retroName + '"');
    setCaptureName(false);
  };
  function handleRetroNameChange(e: React.SetStateAction<string>) {
    if (e == '') {
      setCodeWarning('');
    } else {
      setCodeError('');
    }
    if (e.length >= 60) {
      let count = 80 - e.length;

      if (count === 0) {
        setCodeWarning('No more charachter remaining');
      } else {
        setCodeWarning('Character remaining -' + `${count}`);
      }
    } else {
      setCodeWarning('');
    }
    setRetroName(e);
  }
  function handleTimeFrame(e: React.SetStateAction<string>) {
    setRetroTimeframe(e);
    setisTimeFrameSet(false);
  }
  function handleUsername(e: string) {
    setCodeWarning('');
    setCodeError('');
    if (e.length >= 25) {
      let count = 30 - e.length;
      if (count === 0) {
        setCodeWarning('No more charachter remaining');
      } else {
        setCodeWarning('Character remaining -' + `${count}`);
      }
    }

    setUserName(e);
  }

  const joinRetro = async (): Promise<RetroType | undefined> => {
    let foundRetro = await retro.getByHumanId(humanId);
    if (humanId === '') {
      setCodeError('Please enter access code');
    } else {
      setCodeError('');
    }
    if (!foundRetro) {
      foundRetro = await retro.getById(humanId);
    }
    dispatch({
      type: ActionType.SET_CURRENT_RETRO,
      payload: { retro: foundRetro },
    });
    if (foundRetro) {
      setJoining(true);
      setCaptureName(true);
      return foundRetro;
    } else {
      setCodeError('Sorry, wrong code. Please try again');
    }
  };

  const setName = () => {
    sessionStorage.removeItem('pulseCheckState');
    if (userName !== '') {
      dispatch({
        type: ActionType.SET_PREFERRED_NICKNAME,
        payload: { preferredNickname: userName },
      });
      if (!global.currentRetro || joining) {
        joinRetro().then(retro => {
          if (retro) {
            navigate('/board/' + retro.id + '/pulsecheck');
            setCaptureName(false);
          }
        });
      } else {
        navigate('/board/' + global.currentRetro?.id);
        setCaptureName(false);
      }
    } else {
      setCodeError('Please enter avatar name');
    }
  };

  const reset = () => {
    dispatch({ type: ActionType.CLOSE_CURRENT_RETRO });
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: false },
    });
    setStarted(false);
    setJoining(false);
    setCaptureName(true);
    setHumanId('');
    setUserName('');
    setRetroName('');
    setRetroTimeframe('');
    setCodeError('');
    navigate('/');
  };

  const shareData = {
    title: 'Retro',
    text: 'Join the retro',
    url: global.currentRetro?.joinUrl,
  };

  const share = () => {
    navigator.share(shareData);
  };

  const canShare = navigator.canShare && navigator.canShare(shareData);

  useAzureAuth();

  return (
    <>
      <CssBaseline />
      <Box>
        <img
          src="/images/BACI.png"
          alt="Logo"
          style={{ width: '145px', height: '90px' }}
        />
      </Box>

      <Slide
        direction="up"
        in={!global.currentRetro && !started && !joining && !id}
      >
        <Box
          sx={{
            display:
              !global.currentRetro && !started && !joining && !id
                ? 'flex'
                : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
          }}
        >
          <div style={{ marginBottom: '45px', marginTop: '-70px' }}>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              What BACI retro are you joining today?
            </Typography>
          </div>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box
            sx={{
              '& .MuiInputBase-root-MuiInput-root.Mui-error:after': {
                borderBottom: '1px Solid',
              },
            }}
          >
            <FormControl>
              <Typography sx={{ textAlign: 'center', fontSize: '20px' }}>
                Please enter your access code
              </Typography>
              <TextField
                autoFocus
                variant="standard"
                placeholder="123 456"
                error={!!codeError}
                sx={{
                  input: {
                    borderRadius: '7px',
                    fontSize: '22px',
                    textAlign: 'center',
                    margin: '5px',
                  },
                  '& .css-16xpbqp-MuiInputBase-root-MuiInput-root.Mui-error:after':
                    {
                      borderBottom: '1px solid #d32f2f !important',
                    },
                  color: '#4D555A',
                  minWidth: '300px',
                }}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    joinRetro();
                  }
                }}
                value={humanId}
                onChange={e => setHumanId(e.currentTarget.value)}
              />
              {codeError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#397DE1',
                color: '#fff',
                height: '45px',
                minWidth: '300px',
              }}
              onClick={() => joinRetro()}
            >
              Go on...
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
              marginTop: '45px',
            }}
          >
            <Button
              sx={{
                height: '45px',
                minWidth: '300px',
                color: 'black',
                textAlign: 'center',
                background: '#CDCDD4',
                cursor: 'pointer',
              }}
              onClick={() => {
                dispatch({
                  type: ActionType.SET_RETRO_CREATE,
                  payload: { retroCreateState: true },
                });
                setStarted(true);
                setCodeError('');
              }}
            >
              or Create new retro
            </Button>
          </Box>
        </Box>
      </Slide>
      <Slide direction="up" in={!started && joining && captureName}>
        <Box
          sx={{
            display: !started && joining && captureName ? 'flex' : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{ fontSize: '24px', marginBottom: '60px', marginTop: '-100px' }}
          >
            Welcome to the {localRetroName}!
          </Typography>
          <Typography sx={{ fontSize: '18px' }}>
            What's your Avatar Name?
          </Typography>
          <Divider sx={{ margin: '20px' }}></Divider>
          <FormControl>
            <TextField
              autoFocus
              variant="standard"
              placeholder="Your name or nickname"
              sx={{
                input: { borderRadius: '7px', textAlign: 'center' },
                color: '#4D555A',
                minWidth: '300px',
              }}
              inputProps={{
                maxLength: AVATAR_CHARACTER_LIMIT,
              }}
              error={!!codeError}
              helperText={codeError}
              value={userName}
              onChange={e => handleUsername(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  setName();
                }
              }}
            />
            {codeWarning !== ' ' && (
              <FormHelperText sx={{ color: 'orange' }}>
                {codeWarning}
              </FormHelperText>
            )}
          </FormControl>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#397DE1',
                color: '#fff',
                minWidth: '300px',
                height: '45px',
              }}
              onClick={setName}
            >
              Let's start!
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
              marginTop: '82px',
            }}
          >
            <Link
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={reset}
            >
              To return to the main page click here
            </Link>
          </Box>
        </Box>
      </Slide>
      <Slide direction="up" in={started && !joining && !global.currentRetro}>
        <Box
          sx={{
            display:
              started && !joining && !global.currentRetro ? 'flex' : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '-55px',
          }}
        >
          <Typography style={{ fontSize: '24px' }}>
            Create new BACI retro
          </Typography>
          <Divider sx={{ margin: '20px' }}></Divider>
          <FormControl>
            <TextField
              autoFocus
              variant="standard"
              placeholder="New retro name"
              inputProps={{
                maxLength: RETRONAME_CHARACTER_LIMIT,
              }}
              sx={{
                minWidth: '300px',
                textarea: { borderRadius: '7px', textAlign: 'center' },
                '& .css-s1623g-MuiInputBase-root-MuiInput-root.Mui-error:after':
                  {
                    borderBottom: '1px solid #d32f2f !important',
                  },
              }}
              value={retroName}
              error={!!codeError}
              helperText={codeError}
              onChange={e => handleRetroNameChange(e.currentTarget.value)}
              multiline
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  timeframeRef.current?.focus();
                }
              }}
            />
            {codeWarning !== ' ' && (
              <FormHelperText sx={{ color: 'orange' }}>
                {codeWarning}
              </FormHelperText>
            )}
            <TextField
              inputRef={timeframeRef}
              variant="outlined"
              label="Time Frame"
              sx={{
                color: '#727D84',
                minWidth: '320px',
                marginTop: '30px',
                span: { visibility: 'visible', background: 'white' },
              }}
              value={retroTimeframe}
              select
              onChange={e => handleTimeFrame(e?.target?.value)}
            >
              <MenuItem value={'1 day'}>1 day</MenuItem>
              <MenuItem value={'1 week'}>1 week</MenuItem>
              <MenuItem value={'2 weeks'}>2 weeks</MenuItem>
              <MenuItem value={'3 weeks'}>3 weeks</MenuItem>
              <MenuItem value={'4 weeks'}>4 weeks</MenuItem>
              <MenuItem value={'N/A'}>N/A</MenuItem>
            </TextField>
            {isTimeFrameSet && (
              <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                Please enter time frame
              </FormHelperText>
            )}
          </FormControl>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#397DE1',
                color: '#fff',
                minWidth: '320px',
                height: '45px',
              }}
              onClick={create}
            >
              Create
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
              marginTop: '100px',
            }}
          >
            <Link
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={reset}
            >
              To return to the main page click here
            </Link>
          </Box>
        </Box>
      </Slide>

      <Slide direction="up" in={!!global.currentRetro}>
        <Box
          sx={{
            display: !!global.currentRetro && !captureName ? 'flex' : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '-68px',
          }}
        >
          {global.currentRetro?.creatorId === global.user.id ? (
            <>
              <Typography
                sx={{ my: 1, mx: 2, color: 'black', fontSize: '24px' }}
                color="text.primary"
                align="center"
              >
                Your retro has been created!
              </Typography>
              <Typography
                sx={{
                  my: 0,
                  mx: 2,
                  color: '#4d555a',
                  fontSize: '15px',
                  marginBottom: '28px',
                }}
                color="text.primary"
                align="center"
              >
                {global.currentRetro?.creatorId !== global.user.id
                  ? `You're all set!`
                  : `Retro Name:${global.currentRetro.name}`}
              </Typography>
              <Typography
                sx={{ my: 1, mx: 2, color: 'black', fontSize: '18px' }}
                color="text.primary"
                align="center"
              >
                Retro participation information:
              </Typography>
              <div
                style={{
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <QRCode
                  value={global.currentRetro?.joinUrl || ''}
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
              <Box
                sx={{
                  display: 'flex',
                  minWidth: '400px',
                  justifyContent: 'space-evenly',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '20px',
                  }}
                >
                  <CopyToClipboard text={global.currentRetro?.joinUrl}>
                    <Button
                      sx={{
                        ':hover': { background: '#CDCDD4' },
                        background: '#CDCDD4',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    >
                      Copy link
                    </Button>
                  </CopyToClipboard>
                </div>
              </Box>

              <Grid
                container
                alignItems="center"
                direction="row"
                justifyContent="center"
              >
                <EmailShareButton
                  url={global.currentRetro.joinUrl}
                  style={{ padding: '5px' }}
                >
                  Send via
                  <EmailIcon
                    sx={{
                      color: '#4D555A',
                      width: '18px',
                      height: '18px',
                      marginBottom: '-4px',
                      marginLeft: '3px',
                    }}
                  />
                </EmailShareButton>
                {canShare ? (
                  <Link
                    style={{ padding: '5px', cursor: 'pointer' }}
                    onClick={share}
                  ></Link>
                ) : null}
              </Grid>
            </>
          ) : (
            <Typography
              sx={{ my: 0, mx: 2, fontSize: '1.5rem' }}
              color="text.primary"
              align="center"
            >
              Welcome back
              {global.preferredNickname ? ' ' + global.preferredNickname : ''}!
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px',
            }}
          >
            <Button
              autoFocus
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#397DE1',
                color: '#fff',
                minWidth: '300px',
              }}
              onClick={() => {
                const humanId = global.currentRetro?.humanId;
                dispatch({
                  type: ActionType.SET_RETRO_CREATE,
                  payload: { retroCreateState: false },
                });
                setStarted(false);
                setJoining(true);
                setCaptureName(true);
                setHumanId(humanId as string);
                setUserName('');
                setRetroName('');
                setRetroTimeframe('');
                setCodeError('');
                navigate(`/join/${humanId}`);
              }}
            >
              Go to retro
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
              marginTop: '32px',
            }}
          >
            <Link
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={reset}
            >
              To return to the main page click here
            </Link>
          </Box>
        </Box>
      </Slide>
    </>
  );
}
