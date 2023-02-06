import * as React from 'react';
import {
  Typography,
  Box,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Grid,
  Dialog,
  DialogTitle,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { AVATAR_CHARACTER_LIMIT } from './const';
import Avatar from '../../elements/Avatar';
import { avatarName } from '../../constants/AvatarName';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ContainedButton, OutlinedButton } from '../../components';

const styles = {
  avatarfield: {
    minWidth: '300px',
    '& .MuiFormLabel-root': {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    '& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    '& .css-ov41s0-MuiInputBase-root-MuiInput-root': {
      borderBottom: '0px solid rgba(0, 0, 0, 0.42) !important',
    },
    textarea: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    '& .css-1sop3d1-MuiInputBase-root-MuiInput-root': {
      borderBottom: '0px solid rgba(0, 0, 0, 0.42) !important',
    },
    '& .css-1d1r5q-MuiFormHelperText-root': {
      color: '#d32f2f',
      marginTop: '24px !important',
    },
    '& .css-j7o63n.Mui-error': {
      marginTop: '24px !important',
    },
  },
};

type Props = {
  activePanel: string;
  userName: string;
  userNameError: string;
  userNameWarning: string;
  handleUsername: (username: string) => void;
  selectedAvatar: string;
  avatarSelectionError: string;
  onClickAvatar: (avatarName: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function UserDetailsTab({
  activePanel,
  userName,
  userNameError,
  userNameWarning,
  handleUsername,
  selectedAvatar,
  avatarSelectionError,
  onClickAvatar,
  onClickNext,
  onClickBack,
}: Props) {
  const [openAvatarDialog, setOpenAvatarDialog] = React.useState(false);
  const [avatarList, setAvatarList] = React.useState<string[]>([]);
  const [height, setHeight] = React.useState(0);
  const [tempAvatar, setTempAvatar] = React.useState('');
  const [avatarError, setAvatarError] = React.useState('');

  React.useEffect(() => {
    setAvatarList(avatarName.sort(() => Math.random() - 0.5));
    setHeight(window.innerHeight);
  }, []);

  const onSelectAvatar = (avatarName: string) => {
    setAvatarError('');
    setTempAvatar(avatarName);
  };

  const onClickSubmit = () => {
    if (tempAvatar === '') {
      setAvatarError('Please select an avatar.');
      return;
    }
    onClickAvatar(tempAvatar);
    setOpenAvatarDialog(false);
  };

  const imaSrc = '/avatars/animals/' + selectedAvatar + '.svg';

  return (
    <>
      {/* User Details Panel */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: '#CCCCCC',
          py:
            activePanel != 'userDetailPanel' &&
            userName != '' &&
            selectedAvatar != ''
              ? 2.5
              : 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {activePanel != 'userDetailPanel' &&
          userName != '' &&
          selectedAvatar != '' ? (
            <>
              <Box>
                <Avatar
                  avatar={selectedAvatar}
                  onClickAvatar={() => {}}
                  css={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                  }}
                />
              </Box>
              <Box
                className="tabSummary"
                sx={{
                  color: '#4E4E4E !important',
                  ml: 5,
                }}
              >
                {userName}
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'userDetailPanel'
                    ? '#2c69a1 !important'
                    : '#4E4E4E !important',
              }}
            >
              User Details
            </Typography>
          )}
        </Box>
        {activePanel === 'userDetailPanel' && (
          <Box>
            <Box sx={{ mt: 4 }}>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography className="chooseAvatarText">
                          Choose your avatar
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          ml: 3,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          {selectedAvatar ? (
                            <LazyLoadImage
                              className="avatar"
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                border: '5px solid #f9fbf8',
                              }}
                              src={imaSrc}
                            ></LazyLoadImage>
                          ) : (
                            <LazyLoadImage
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                border: '5px solid #f9fbf8',
                              }}
                              src="../svgs/Empty-Animals.svg"
                            ></LazyLoadImage>
                          )}
                          <Button onClick={() => setOpenAvatarDialog(true)}>
                            <span className="selectAvatarButtonText">
                              Select Avatar
                            </span>
                          </Button>
                        </Box>
                        <Box>
                          {avatarSelectionError !== '' && (
                            <FormHelperText
                              sx={{ color: '#d32f2f', marginLeft: '10px' }}
                            >
                              {avatarSelectionError}
                            </FormHelperText>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Box>
                      <TextField
                        id="choose retro name"
                        label="Choose your name for this retro"
                        variant="standard"
                        sx={styles.avatarfield}
                        value={userName}
                        onChange={e => handleUsername(e.currentTarget.value)}
                        inputProps={{
                          maxLength: AVATAR_CHARACTER_LIMIT,
                        }}
                        error={!!userNameError}
                        helperText={userNameError}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </FormControl>
            </Box>
            <Box
              sx={{
                width: '10%',
                display: 'flex',
                flex: '1 0 auto',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <ContainedButton
                name="Finish"
                onClick={() => onClickNext('userDetailPanel', '')}
                style={{
                  mt: 5,
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
              />
              <OutlinedButton
                name="Back"
                onClick={() => onClickBack('pulseCheckPanel')}
                style={{
                  minWidth: '75px !important',
                  height: '36px !important',
                  mt: 5,
                }}
              />
            </Box>
          </Box>
        )}
        <Dialog
          open={openAvatarDialog}
          sx={{
            height: height - 100,
          }}
        >
          <DialogTitle>
            <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item sm={6}>
                <Box display="flex" justifyContent="flex-start">
                  <Typography component="span" className="selectAvatarText">
                    Select Avatar
                  </Typography>
                </Box>
              </Grid>
              <Grid item sm={6}>
                <Box display="flex" justifyContent="flex-end">
                  <img
                    width="45px"
                    height="45px"
                    onClick={() => setOpenAvatarDialog(false)}
                    src="/svgs/CloseDialog.svg"
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogTitle>
          <Box
            className="avatarDialog"
            sx={{
              height: height / 2,
            }}
          >
            {avatarList.map((avatar: any, index) => (
              <Avatar
                key={index}
                avatar={avatar}
                className="avatarSvgXs"
                onClickAvatar={onSelectAvatar}
                selectedAvatar={tempAvatar}
                css={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  margin: '16px',
                }}
              ></Avatar>
            ))}
          </Box>
          <Box sx={{ mx: 3, mt: 2 }}>
            {avatarError !== '' && (
              <FormHelperText sx={{ color: '#d32f2f', mt: 2 }}>
                {avatarError}
              </FormHelperText>
            )}
          </Box>
          <Box sx={{ mx: 3 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flex: '1 0 auto',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                my: 2,
              }}
            >
              <OutlinedButton
                name="Cancel"
                onClick={() => setOpenAvatarDialog(false)}
                style={{
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
              />
              <ContainedButton
                name="Select"
                onClick={onClickSubmit}
                style={{
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
              />
            </Box>
          </Box>
        </Dialog>
      </Box>
    </>
  );
}
