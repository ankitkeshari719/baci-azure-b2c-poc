import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import Avatar from './Avatar';
import BACILogo from '../assets/img/bacilogo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { RetroDetails } from '../screens/RetroDetails';
import commonStyles from './../style.module.scss';
import SessionEndingMessage from '../atoms/SessionEndingMessage';
import LeaveRetroDialog from '../atoms/LeaveRetroDialog';
import theme from '../theme/theme';
import { CountdownTimer } from './CountdownTimer';
import FacilitatorDropDown from './FacilitatorDropDown';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
// import { ReactComponent as InfoSvg } from '../../public/svgs/Info.svg';
const Toolbar = (props: any) => {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [{ avatar, currentRetro, user, leaveRetro, loadingFlag }] =
    React.useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const showFinishRetroButton =
    !location.pathname.includes('pulsecheck') &&
    !location.pathname.includes('report') &&
    !location.pathname.includes('startRetro') &&
    !location.pathname.includes('waiting') &&
    !location.pathname.includes('offboarding');
  // const [editing, setEditing] = React.useState(true);
  const RETRONAME_CHARACTER_LIMIT = 80;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [leaveDiaOpen, setLeaveDiaOpen] = React.useState(false);

  const {
    state: {
      retroName,
      retroGoal,
      retroTimeframe,
      startedTimeStamp,
      retroDuration,
      users,
      ended,
    },
    commitAction,
  } = React.useContext(BoardContext);

  const [localRetroName, setLocalRetroName] = React.useState(
    currentRetro?.name
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [anchorE2, setAnchorE2] = React.useState<HTMLButtonElement | null>(
    null
  );
  const openMenu = Boolean(anchorE2);

  const [showSessionEndMessage, setShowSessionEndMessage] =
    React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [showSummaryButton, setShowSummaryButton] = React.useState(false);
  const { instance, inProgress } = useMsal();

  
  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };
  function WelcomeUser() {
    const { accounts } = useMsal();
    console.log(accounts);
    const name = accounts[0]?.name;
    return <><Typography variant="body1" color={commonStyles.primaryDark}>
      Hello, {name}
    </Typography><>
        <Button onClick={() => handleLogoutRedirect()}>
          Sign Out
        </Button>
      </></>
   }
  
  React.useEffect(() => {
    if (retroName && retroName !== '') setLocalRetroName(retroName);
  }, [retroName]);
  React.useEffect(() => {
    if (!loadingFlag && ended) {
      setShowSummaryButton(true);
    }
  }, [loadingFlag, ended]);
  React.useEffect(() => {
    if (showFinishRetroButton && !leaveRetro) {
      const timer = setInterval(() => {
        const endTime = retroDuration - 5 * 60 * 1000;
        const currentEpoch = Date.now();

        if (
          endTime <= currentEpoch &&
          !location.pathname.includes('startRetro') &&
          !location.pathname.includes('waiting')
        ) {
          setShowSessionEndMessage(true);
          clearTimeout(timer);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retroDuration !== 0]);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user?.id,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          width: !location.pathname.includes('offboarding')
            ? isXsUp
              ? 'calc(100% - 32px)'
              : 'calc(100% - 112px)'
            : 'calc(100%)',
          paddingLeft: isXsUp ? '16px' : '56px',
          paddingRight: isXsUp ? '16px' : '56px',
          paddingTop: isXsUp ? '14px' : 0,
          paddingBottom: isXsUp ? '14px' : 0,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)!important',
        }}
      >
        {location.pathname.includes('report') ? (
          <>
            <Button onClick={() => navigate('/')}>
              <img
                src={BACILogo}
                alt="Logo"
                style={{
                  width: isXsUp ? '53px' : '82px',
                  height: isXsUp ? '18px' : '28px',
                }}
              />
            </Button>
          </>
        ) : (
          <img
            src={BACILogo}
            alt="Logo"
            style={{
              width: isXsUp ? '53px' : '82px',
              height: isXsUp ? '18px' : '28px',
            }}
          />
        )}

        {currentRetro?.name &&
          !location.pathname.includes('startRetro') &&
          !location.pathname.includes('offboarding') &&
          (location.pathname.includes('pulsecheck') ||
            window.location.pathname.includes('board')) && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: 'calc(100% - 512px)',
              }}
            >
              {user.userType == 2 && !ended ? (
                <Tooltip title={localRetroName + ''}>
                  <TextField
                    // noWrap
                    // multiline
                    fullWidth
                    InputLabelProps={
                      {
                        // style: { fontSize: 0 },
                      }
                    }
                    sx={{
                      fieldset: { border: 'none' },
                      color: '#2C69A1',
                      // minWidth: '200px',
                      width: isXsUp ? '150px' : '270px',
                      minWidth: isXsUp ? '150px' : '270px',
                      marginLeft: isXsUp ? '10px' : '34px',
                      overflow: 'hidden !important',
                      textOverflow: 'ellipsis',
                      div: { padding: 0, position: 'initial' },
                      '& .MuiInputBase-input': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                    }}
                    InputProps={{
                      style: {
                        fontSize: isXsUp ? '16px' : 24,
                        color: '#2C69A1',
                        // borderBottom: 'none!important',
                        width: '250px',
                        borderBottom: '0px solid!important',
                        overflow: 'hidden !important',
                        textOverflow: 'ellipsis',
                        // height:'100px'
                      },

                      // endAdornment: (
                      //   <InputAdornment position="start">
                      //     <Button
                      //       onClick={() => {
                      //         setEditing(false);
                      //       }}
                      //     >
                      //       save
                      //     </Button>
                      //   </InputAdornment>
                      // ),
                    }}
                    value={localRetroName}
                    onChange={e => {
                      setLocalRetroName(e.currentTarget.value);
                    }}
                    onBlur={async () => {
                      await saveAndProcessAction(
                        BoardActionType.UPDATE_RETRO_DETAILS,
                        {
                          retroName: localRetroName,
                          creatorId: currentRetro.creatorId,
                          userId: user.id,
                        }
                      );
                    }}
                    onKeyDown={async e => {
                      if (e.keyCode === 13) {
                        await saveAndProcessAction(
                          BoardActionType.UPDATE_RETRO_DETAILS,
                          {
                            retroName: localRetroName,
                            creatorId: currentRetro.creatorId,
                            userId: user.id,
                          }
                        );
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  />
                </Tooltip>
              ) : (
                <Typography
                  noWrap
                  sx={{
                    color: '#2C69A1',
                    ag: 'H3',
                    marginLeft: isXsUp ? '10px' : '34px',
                    fontSize: isXsUp ? '16px!important' : '24px!important',

                    minWidth: isXsUp ? '150px' : '250px',
                    maxWidth: isXsUp ? '150px' : '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    // height:'56px'
                    // overflow: 'hidden !important',
                    // textOverflow: 'ellipsis',
                  }}
                  // onClick={() => {
                  //   setEditing(true);
                  // }}
                >
                  {localRetroName}
                </Typography>
              )}

              {!isXsUp && (
                <>
                  <span style={{ width: '220px', display: 'flex' }}>
                    <Typography
                      sx={{
                        fontSize: '20px',
                        color: '#2C69A1',
                        // marginLeft: '66px',
                        width: user.userType == 2 ? '150px' : '150px',
                      }}
                    >
                      Code : {currentRetro?.humanId}
                    </Typography>
                    <Button
                      aria-describedby={id}
                      sx={{ borderRadius: '25%' }}
                      onClick={handleClick}
                    >
                      <img src="/svgs/Info.svg" />
                    </Button>
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
                      <RetroDetails
                        popover={true}
                        close={handleClose}
                      ></RetroDetails>
                    </Popover>
                  </span>

                  {!ended ? <FacilitatorDropDown /> : null}
                </>
              )}
            </Box>
          )}

        <Box component="span" sx={{ flex: '1 1 auto' }}></Box>
        <AuthenticatedTemplate>
                      <WelcomeUser />
            </AuthenticatedTemplate>
        {showFinishRetroButton && !ended && (
          <>
            {user.userType == 2 ? (
              <>
                <Button
                  variant="contained"
                  id="finishRetro"
                  sx={{
                    // background: '#159ADD',
                    // color: 'white',
                    borderRadius: '24px',
                    width: '148px',
                    height: '44px',
                    padding: '10px 20px',
                    marginRight: '40px',
                    fontWeight: 500,
                    display: isXsUp ? 'none' : 'block',
                  }}
                  onClick={() => setOpenDialog(true)}
                  // onTouchStart={() => setOpenDialog(true)}
                >
                  FINISH RETRO
                </Button>
                {showSessionEndMessage && (
                  <SessionEndingMessage
                    hideSessionEndingMessage={() => {
                      setShowSessionEndMessage(false);
                    }}
                    isXsUp={isXsUp}
                  />
                )}
              </>
            ) : (
              <>
                {' '}
                {!leaveRetro && (
                  <Button
                    id="leaveRetro"
                    variant="contained"
                    sx={{
                      // background: '#159ADD',
                      // color: 'white',
                      borderRadius: '24px',
                      width: '148px',
                      height: '44px',
                      padding: '10px 20px',
                      marginRight: '40px',
                      fontWeight: 500,
                      display: isXsUp ? 'none' : 'block',
                    }}
                    onClick={() => setLeaveDiaOpen(true)}
                    // onTouchStart={() => setLeaveDiaOpen(true)}
                  >
                    LEAVE RETRO
                  </Button>
                )}
                {showSessionEndMessage && (
                  <SessionEndingMessage
                    isXsUp={isXsUp}
                    hideSessionEndingMessage={() => {
                      setShowSessionEndMessage(false);
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
        {showSummaryButton && !location.pathname.includes('report') && (
          <Button
            // variant="outlined"
            // className="secondaryButton"
            style={{
              marginRight: '40px',
            }}
            variant="contained"
            sx={{
              borderRadius: '24px',
              padding: '10px 20px',
              width: '162px',
              marginRight: '15px',
              fontWeight: 500,
            }}
            onClick={() => navigate('/report/' + currentRetro?.id)}
            // onTouchStart={() => joinRetro()}
          >
            VIEW SUMMARY
          </Button>
        )}
        <LeaveRetroDialog
          open={leaveDiaOpen}
          onClose={(value: any) => {
            // console.log(value, 'value');
            if (value) props.onFinishRetro();
            setLeaveDiaOpen(false);
          }}
        />
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              marginTop: '15px',
            }}
          >
            <span
              style={{
                background: 'url(/svgs/Finish.svg)',
                width: '288px',
                height: '209px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  paddingTop: '100px',
                  color: commonStyles.secondaryMain,
                  fontSize: '28px',
                }}
              >
                Finish Retro ?
              </span>
            </span>
          </div>

          <DialogContent>
            <span
              style={{
                color: '#343434',
                fontSize: '20px',
                width: '488px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span> This will end retro for all participants.</span>
              <span> All participants will see feedback screen.</span>
            </span>
            {/* </DialogContentText> */}
          </DialogContent>
          <DialogActions style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              sx={{ borderRadius: '24px', fontSize: '16px', marginTop: '15px' }}
              onClick={() => {
                props.onFinishRetro(), setOpenDialog(false);
              }}
              // onTouchStart={() => {
              //   props.onFinishRetro(), setOpenDialog(false);
              // }}
              variant="contained"
              autoFocus
            >
              END RETRO AND VIEW SUMMARY
            </Button>
            <Button
              sx={{
                borderRadius: '24px',
                fontSize: '16px',
                marginTop: '15px',
                marginBottom: '15px',
              }}
              variant="outlined"
              onClick={() => setOpenDialog(false)}
              // onTouchStart={() => setOpenDialog(false)}
            >
              CONTINUE WITH RETRO
            </Button>
          </DialogActions>
        </Dialog>

        {location.pathname.includes('report') && (
          <>
            {' '}
            <Typography
              color={commonStyles.secondaryMain}
              fontSize="28px"
              fontWeight="500"
              mr="15px"
            >
              Retro Finished
            </Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: '24px',
                padding: '10px 20px',
                width: '162px',
                marginRight: '15px',
                fontWeight: 500,
              }}
              onClick={() => {
                navigate('/board/' + currentRetro?.id);
              }}
            >
              REVIEW BOARD
            </Button>
          </>
        )}

        {isXsUp ? (
          <>
            <Button
              aria-describedby={id}
              sx={{
                borderRadius: '25%',
                marginLeft: '15px',
                position: 'initial',
              }}
              onClick={handleClick1}
            >
              <img src="/svgs/MobileMenu.svg" />
            </Button>

            <Menu
              anchorEl={anchorE2}
              id="account-menu"
              open={openMenu}
              onClose={() => setAnchorE2(null)}
              onClick={() => setAnchorE2(null)}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                sx={{ width: '250px', display: 'flex', flexDirection: 'row' }}
              >
                <Avatar
                  avatar={user?.avatar}
                  onClickAvatar={() => {
                    console.log('click');
                  }}
                  css={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                  }}
                ></Avatar>
                <Typography
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    maxWidth: '150px',
                    width: '150px',
                  }}
                >
                  {user?.name}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            {user?.avatar && (
              <Avatar
                avatar={user?.avatar}
                onClickAvatar={() => {}}
                css={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: 'none',
                }}
              ></Avatar>
            )}
          </>
        )}
      </Box>
      <Box
        sx={{
          display: isXsUp ? 'flex' : 'none',
          flexDirection: 'row-reverse!important',
          justifyContent: 'space-between',
          width: '100%!important',
          marginTop: '10px',
          marginBottom: isXsUp ? '10px' : 0,
        }}
      >
        {!leaveRetro && showFinishRetroButton && (
          <Button
            id="leaveRetroIsXsUp"
            variant="contained"
            sx={{
              // background: '#159ADD',
              // color: 'white',
              borderRadius: '24px',
              width: '148px',
              height: '44px',
              padding: '10px 20px',
              marginRight: '16px',
              fontWeight: 500,
              position: 'initial',
            }}
            onClick={() => setLeaveDiaOpen(true)}
            // onTouchStart={() => setLeaveDiaOpen(true)}
          >
            LEAVE RETRO
          </Button>
        )}
        {!ended && (
          <CountdownTimer color={'#2B9FDE'} bold={true}></CountdownTimer>
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
