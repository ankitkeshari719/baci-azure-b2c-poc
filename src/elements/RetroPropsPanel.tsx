import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';

import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import theme from '../theme/theme';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
export default function RetroPropsPanel({
  onClose,
  setShowSharePanel,
}: {
  onClose: () => void;
  setShowSharePanel: (val: boolean) => void;
}) {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));
  const [isEditClicked, setIsEditClick] = useState(false);
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: { retroName, retroGoal, retroTimeframe },
    commitAction,
  } = React.useContext(BoardContext);
  const [localRetroName, setLocalRetroName] = React.useState(
    retroName || global.currentRetro?.name
  );
  const [localRetroGoal, setLocalRetroGoal] = React.useState(retroGoal);
  const [localRetroTimeframe, setLocalRetroTimeframe] =
    React.useState(retroTimeframe);

  React.useEffect(() => {
    setLocalRetroName(retroName);
  }, [retroName]);

  React.useEffect(() => {
    setLocalRetroGoal(retroGoal);
  }, [retroGoal]);

  React.useEffect(() => {
    setLocalRetroTimeframe(retroTimeframe);
  }, [retroTimeframe]);
  const editRetroNameClickHandler = () => {
    setIsEditClick(true);
  };
  const doneEditRetroNameClickHandler = () => {
    setIsEditClick(false);
  }
  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          background: '#88888888',
          width: '100vw',
          height: '100%',
          display: 'flex',
          zIndex: 22,
          paddingTop: '2px',
        }}
        onClick={onClose}
      >
        <Box
          sx={{
            background: 'white',
            width: '300px',
            height: '100%',
            ...(isXsUp
              ? {
                  position: 'fixed',
                  right: 0,
                  left: 0,
                  width: '100vw',
                  top: 0,
                  bottom: 0,
                }
              : {}),
          }}
          onClick={e => e.stopPropagation()}
        >
          {isXsUp ? (
            <>
              <Grid container sx={{ background: 'white' }}>
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Button onClick={onClose}>
                    <CloseIcon />
                  </Button>
                </Grid>
                <Grid item xs={11}>
                  <Typography
                    sx={{
                      display: 'flex',
                      padding: '2px',
                      fontWeight: 'bolder',
                      justifyContent: 'center',
                    }}
                  >
                    Info
                  </Typography>
                </Grid>
              </Grid>
              <Divider
                color="#CDCDD4"
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </>
          ) : null}

          <Box
            sx={{
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {!isXsUp ? (
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  margin: '30px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Info
              </Typography>
            ) : null}

            <div style={{ width: '100%' }}>
              {isEditClicked ? (
                <div style={{
                  display: 'inline-flex',
                  verticalAlign: 'text-bottom',
                  boxSizing: 'inherit',
                  textAlign: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                  <div style={{ width: '70%' }}>
                  <TextField
                  multiline
                  variant="standard"
                  label="Retro Name"
                  sx={{ color: '#727D84', minWidth: '200px', margin: '10px' }}
                  value={localRetroName}
                  onChange={e => {
                    setLocalRetroName(e.currentTarget.value);
                  }}
                  onBlur={async () => {
                    await saveAndProcessAction(
                      BoardActionType.UPDATE_RETRO_DETAILS,
                      {
                        retroName: localRetroName,
                      }
                    );
                  }}
                  onKeyDown={async e => {
                    if (e.keyCode === 13) {
                      await saveAndProcessAction(
                        BoardActionType.UPDATE_RETRO_DETAILS,
                        {
                          retroName: localRetroName,
                          
                        }
                      );
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
                </div>
                <div style={{ width: '30%' }}>
                      <Button onClick={doneEditRetroNameClickHandler}>
                        <DoneIcon color="disabled" fontSize='large' />
                      </Button>
                    </div>
                </div>
                
              ) : (
                <>
                  <div>
                    <Typography style={{ marginLeft: '5px', color: '#00000099' }}>Retro Name</Typography>
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      verticalAlign: 'text-bottom',
                      boxSizing: 'inherit',
                      textAlign: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div style={{width: '70%'}}>
                      <Typography style={{ marginLeft: '10px', float: 'left' }}>
                        {localRetroName}
                      </Typography>
                    </div>
                    <div style={{ width: '30%' }}>
                      <Button onClick={editRetroNameClickHandler}>
                        <EditIcon color="disabled" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* <Select
                variant="outlined"
                label="Time Frame"
                displayEmpty
                renderValue={value => (value !== '' ? value : 'Time frame')}
                sx={{
                  color: '#727D84',
                  minWidth: '200px',
                  margin: '10px',
                  span: { visibility: 'visible', background: 'white' },
                }}
                value={localRetroTimeframe}
                onChange={e => {
                  setLocalRetroTimeframe(e.target.value);
                }}
                onBlur={() => {
                  saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
                    retroTimeframe: localRetroTimeframe,
                  });
                }}
              >
                <MenuItem value={'1 day'}>1 day</MenuItem>
                <MenuItem value={'1 week'}>1 week</MenuItem>
                <MenuItem value={'2 weeks'}>2 weeks</MenuItem>
                <MenuItem value={'3 weeks'}>3 weeks</MenuItem>
                <MenuItem value={'4 weeks'}>4 weeks</MenuItem>
                <MenuItem value={'N/A'}>N/A</MenuItem>
              </Select> */}
            <div style={{ width: '100%' }}>
              <div style={{ padding: '5px', margin: '5px' }}>
                <Typography style={{ color: '#00000099' }}>
                  Time Frame
                </Typography>
              </div>
              <div style={{ padding: '5px', margin: '5px' }}>
                <Typography style={{}}>{localRetroTimeframe}</Typography>
              </div>
            </div>

            {isXsUp || isSmUp ? (
              <Box
                sx={{
                  flexDirection: 'column',
                  display: 'flex',
                  padding: '20px',
                  gap: '10px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    color: 'black',
                    border: '2px #FECE8B solid',
                    padding: '3px',
                  }}
                >
                  Retro Access Code: {global.currentRetro?.humanId}
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    background: '#FECE8B',
                    color: 'black',
                    padding: '4px',
                    marginLeft: '4px',
                    borderRadius: 0,
                    borderColor: '#FECE8B',
                  }}
                  onClick={() => setShowSharePanel(true)}
                >
                  Share
                </Button>
              </Box>
            ) : null}
          </Box>

          {isXsUp ? (
            <Link
              sx={{
                display: 'flex',
                margin: '30px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
              }}
              onClick={onClose}
            >
              Back to Retro
            </Link>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
