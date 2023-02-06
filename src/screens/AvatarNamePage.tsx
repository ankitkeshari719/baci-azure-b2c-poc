import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import { LandingLayout } from './LandingLayout';
import commonStyles from './../style.module.scss';
import './../global.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { Retro as RetroType } from '../types';
import { useRetro } from '../helpers';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import Avatar from '../elements/Avatar';
import { avatarName } from '../constants/AvatarName';
import { useAzureAuth } from '../msal/azureauth';
import { UserTypeArray } from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { useMsal } from '@azure/msal-react';
import theme from '../theme/theme';
const AVATAR_CHARACTER_LIMIT = 30;
const styles = {
  avatarfield: {
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '14px',
    },
  },
  chooseAvatarText: {
    marginTop: '32px',
    marginBottom: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  avatarBox: {
    width: '527px',
    height: '220px',
    overflowY: 'auto',
  },
  goOnBtn: {
    marginTop: '48px',
  },
  avatarSvg: {
    width: '60px',
    height: '60px',
    marginBottom: '30px',
    marginRight: '30px',
    borderRadius: '50%',
  },
  avatarSvgXs: {
    width: '50px',
    height: '50px',
    marginBottom: '15px',
    borderRadius: '50%',
  },
};

export function AvatarNamePage() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroName, setRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );
  const {
    state: {
      users,
      creatorId,
      retroId,
      retroStarted,
      ended,
      needsToShow,
      retroStatus,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const [selectedAvatar, setAvatar] = React.useState('');
  const [avatarList, setAvatarList] = React.useState<string[]>([]);

  const [userName, setUserName] = React.useState('');
  const AVATAR_COUNT = 57;
  const [codeError, setCodeError] = React.useState('');
  const [codeWarning, setCodeWarning] = React.useState('');
  const [avatarSelectionError, setAvatarSelectionError] = React.useState('');
  const { id } = useParams();
  const [humanId, setHumanId] = React.useState(id || '');
  const retro = useRetro();
  const navigate = useNavigate();
  const [started, setStarted] = React.useState(
    global.retroCreateState || false
  );
  const [joining, setJoining] = React.useState(id ? true : false);
  const [captureName, setCaptureName] = React.useState(id ? true : false);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [openAvatarDialog, setOpenAvatarDialog] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const { accounts } = useMsal();

  React.useEffect(() => {
    setAvatarList(avatarName.sort(() => Math.random() - 0.5));
    setHeight(window.innerHeight);

    //find out if logged in
    if (accounts){
      setUserName(typeof accounts[0]?.name === 'string' ? accounts[0]?.name : '')

    }
  }, []);
  useAzureAuth();
  const joinRetro = async (
    retrunBool: boolean
  ): Promise<RetroType | undefined> => {
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
    if (retrunBool) {
      return;
    }
    if (foundRetro) {
      setJoining(true);
      setCaptureName(true);
      return foundRetro;
    } else {
      setCodeError('Sorry, wrong code. Please try again');
    }
  };
  const onClickAvatar = (avatarName: any) => {
    setAvatar(avatarName);
    setAvatarSelectionError('');
  };

  const setName = () => {
    sessionStorage.removeItem('pulseCheckState');
    if (userName !== '' && selectedAvatar !== '') {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      const userTypeValue: number =
        global?.user?.id == global.currentRetro?.creatorId
          ? UserTypeArray[1].id
          : UserTypeArray[0].id;
      dispatch({
        type: ActionType.SET_PREFERRED_NICKNAME,
        payload: {
          preferredNickname: userName,
          avatar: selectedAvatar,
          userType: userTypeValue,
        },
      });
      if (!global.currentRetro || joining) {
        joinRetro(false).then(retro => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
          if (retro) {
            if (global.currentRetro?.creatorId === global.user?.id) {
              navigate('/board/' + retro.id + '/startRetro');
            } else {
              navigate('/board/' + retro.id + '/waiting');

              setCaptureName(false);
            }
          }
        });
      } else {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        navigate('/board/' + global.currentRetro?.id);
        setCaptureName(false);
      }
    } else {
      if (userName === '') setCodeError('Please enter avatar name');
      else {
        setAvatarSelectionError('Please select avatar');
        console.log(avatarSelectionError);
      }
    }
  };
  const handleUsername = (e: string) => {
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
    if (selectedAvatar != '') {
      setAvatarSelectionError('');
    }

    setUserName(e);
  };
  React.useEffect(() => {
    if (
      !global.user.id ||
      global.user.id == undefined ||
      global.user.id == null
    ) {
      useAzureAuth;
    } else {
    }
    if (!global.currentRetro?.name) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      joinRetro(true).then(
        res => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });

          data123();
        },
        err => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );
    } else {
      data123();
    }
  }, [users, global?.user?.id]);

  const data123 = (): any => {
    if (
      retroId != undefined &&
      retroId != '' &&
      retroId == global?.currentRetro?.id &&
      global.user.id != ''
    ) {
      const currentUser: any = users.find(
        user => user.userId === global.user.id
      );
      if (currentUser) {
        const userTypeValue: number =
          global?.user?.id == global.currentRetro?.creatorId
            ? UserTypeArray[1].id
            : UserTypeArray[0].id;
        dispatch({
          type: ActionType.SET_USER,
          payload: {
            user: {
              id: currentUser.userId,
              name: currentUser.userNickname,
              avatar: currentUser.avatar,
              userType: userTypeValue,
            },
          },
        });

        if (ended || retroStarted) {
          if (ended && currentUser.userId == global.currentRetro?.creatorId) {
            navigate('/report/' + global.currentRetro?.id);
          } else {
            if (currentUser?.pulseCheckQuestions?.length > 0)
              navigate('/board/' + global.currentRetro?.id);
            else navigate('/board/' + global.currentRetro?.id + '/pulseCheck');
          }
        } else {
          if (currentUser.userId == global.currentRetro?.creatorId && !isXsUp) {
            navigate('/board/' + global.currentRetro?.id + '/startRetro');
          } else {
            navigate('/board/' + global.currentRetro?.id + '/waiting');
          }
        }
      }
    }
  };
  return (
    <Grid container spacing={0} style={{ overflowY: 'auto' }}>
      <Grid item xs={isXsUp ? 12 : 6}>
        <LandingLayout></LandingLayout>
      </Grid>
      <Grid
        item
        xs={isXsUp ? 12 : 6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          container
          marginRight={isXsUp ? '0px' : commonStyles.m_80}
          marginLeft={isXsUp ? '0px' : commonStyles.m_80}
          flexDirection="row"
          sx={{
            height: !isXsUp ? height : (height - 100) / 2,

            width: isXsUp ? '90%' : '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {!global.currentRetro?.creatorId ? (
              <>
                <Typography variant="h1" color={commonStyles.primaryDark}>
                  Welcome to the BACI
                </Typography>
                <Typography
                  variant="h3"
                  color={commonStyles.primaryDark}
                  mt="30px"
                >
                  Who you are in ‘{global.currentRetro?.name}’?
                </Typography>
              </>
            ) : !isXsUp ? (
              <Typography variant="h3" color={commonStyles.primaryDark}>
                Who you are in ‘{global.currentRetro?.name}’?
              </Typography>
            ) : (
              <>
                <Typography
                  variant="h3"
                  color={commonStyles.primaryDark}
                  className="alignCenter"
                >
                  Welcome to BACI
                </Typography>
                <Typography
                  variant="h5"
                  color={commonStyles.primaryDark}
                  className="alignCenter"
                >
                  Pick Your Avatar
                </Typography>
              </>
            )}

            <FormControl sx={{ width: !isXsUp ? '322px' : '100%' }}>
              <TextField
                id="standard-helperText"
                label="Choose your name for this retro"
                variant="standard"
                sx={{ ...styles.avatarfield, marginTop: '32px' }}
                value={userName}
                onChange={e => handleUsername(e.currentTarget.value)}
                inputProps={{
                  maxLength: AVATAR_CHARACTER_LIMIT,
                }}
                error={!!codeError}
                helperText={codeError}
              />
              {codeWarning !== ' ' && (
                <FormHelperText sx={{ color: 'orange' }}>
                  {codeWarning}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          {!isXsUp ? (
            <Box>
              <Typography sx={styles.chooseAvatarText}>
                Choose your avatar
              </Typography>
              <Box sx={styles.avatarBox}>
                {avatarList
                  .map((avatar: any, index) => (
                    <Avatar
                      key={index}
                      avatar={avatar}
                      css={styles.avatarSvg}
                      onClickAvatar={onClickAvatar}
                      selectedAvatar={selectedAvatar}
                    ></Avatar>
                  ))}
              </Box>
              {avatarSelectionError !== '' && (
                <Box
                  sx={{
                    color: '#d32f2f',
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: '0.75rem',
                    lineHeight: 1.66,
                    letterSpacing: '0.03333em',
                    textAlign: 'left',
                    marginTop: '3px',
                    marginRight: '0',
                    marginBottom: '0',
                    marginLeft: '0',
                  }}
                >
                  {avatarSelectionError}
                </Box>
              )}
              <Button
                variant="outlined"
                className="secondaryButton"
                style={styles.goOnBtn}
                onClick={setName}
              >
                <span className="secondaryButtonText">Go on..</span>
              </Button>
            </Box>
          ) : (
            <>
              <Box mt="5%">
                <Box display="flex">
                  {selectedAvatar && (
                    <Avatar
                      avatar={selectedAvatar}
                      css={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                      }}
                    ></Avatar>
                  )}
                  <Button onClick={() => setOpenAvatarDialog(true)}>
                    <span className="primaryButtonText">Select Avatar</span>
                  </Button>
                </Box>
                {avatarSelectionError !== '' && (
                  <FormHelperText sx={{ color: 'red', marginLeft: '10px' }}>
                    {avatarSelectionError}
                  </FormHelperText>
                )}
                <Button
                  variant="outlined"
                  className="secondaryButton"
                  style={styles.goOnBtn}
                  onClick={setName}
                >
                  <span className="secondaryButtonText">Go on..</span>
                </Button>
              </Box>
              <Dialog open={openAvatarDialog} sx={{ height: height - 100 }}>
                <DialogTitle>
                  <Typography>Select Avatar</Typography>
                </DialogTitle>
                <Box
                  sx={{
                    width: '90%',
                    padding: '16px',
                    height: height / 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    overflowY: 'scroll',
                  }}
                >
                  {avatarList.map((avatar: any, index) => (
                    <Avatar
                      key={index}
                      avatar={avatar}
                      css={styles.avatarSvgXs}
                      onClickAvatar={onClickAvatar}
                      selectedAvatar={selectedAvatar}
                    ></Avatar>
                  ))}
                </Box>
                <Box display="flex" justifyContent="center" mb="10px">
                  <Button
                    variant="outlined"
                    className="secondaryButton"
                    onClick={() => setOpenAvatarDialog(false)}
                    sx={{ width: '90%' }}
                    disabled={selectedAvatar == ''}
                  >
                    <span className="secondaryButtonText">Select</span>
                  </Button>
                </Box>
              </Dialog>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
