import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useMemo } from 'react';

import { BoardContext } from '../contexts/BoardContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { UserAvatar } from '../atoms/UserAvatar';
import theme from '../theme/theme';

export default function ParticipantsPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [{ user: globalUser, preferredNickname }, dispatch] =
    React.useContext(GlobalContext);
  const {
    state: { columns, users, retroName, lastStateUpdate },
  } = React.useContext(BoardContext);

  const [userName, setUserName] = React.useState(preferredNickname || '');

  const submitUserName = (name: string) => {
    dispatch({
      type: ActionType.SET_PREFERRED_NICKNAME,
      payload: { preferredNickname: name },
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
          justifyContent: 'flex-end',
        }}
        onClick={onClose}
      >
        <Box
          sx={{
            background: 'white',
            width: '40%',
            overflowY: 'scroll',
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
              <Grid container>
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
                    {retroName}
                  </Typography>
                  <Typography
                    sx={{
                      display: 'flex',
                      padding: '2px',
                      justifyContent: 'center',
                    }}
                  >
                    {users.length} Participants
                  </Typography>
                </Grid>
              </Grid>
              <Divider
                color="#CDCDD4"
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </>
          ) : null}

          <Grid
            sx={{
              flexDirection: 'column',
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
                {users.length} Participants
              </Typography>
            ) : null}
            <TableContainer sx={{ maxHeight: '100%' }}>
              {useMemo(
                () => (
                  <Table stickyHeader>
                    {[...users]
                      .sort((a, b) =>
                        a.userNickname.localeCompare(b.userNickname)
                      )
                      .map(user => (
                        <TableRow
                          key={user.userId}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <TableCell align="center" style={{ width: '50px' }}>
                            <UserAvatar
                              key={user.userId}
                              userNickname={user.userNickname}
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              flex: 1,
                            }}
                          >
                            {globalUser.id === user.userId ? (
                              <TextField
                                sx={{
                                  input: { padding: 0 },
                                  fieldset: { border: 'none' },
                                  position: 'initial',
                                  div: { position: 'initial' },
                                }}
                                value={userName}
                                onKeyDown={e => {
                                  if (e.keyCode === 13) {
                                    submitUserName(userName);
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                onChange={e =>
                                  setUserName(e.currentTarget.value)
                                }
                                onBlur={() => submitUserName(userName)}
                                onSubmit={() => submitUserName(userName)}
                              ></TextField>
                            ) : (
                              user.userNickname
                            )}
                          </TableCell>
                          <TableCell align="left">
                            <Typography
                              sx={{
                                display: columns.find(c =>
                                  c.groups.find(c =>
                                    c.cards.find(
                                      c => c.createdBy === user.userId
                                    )
                                  )
                                )
                                  ? 'inline'
                                  : 'none',
                                background: '#DCDCE1',
                                padding: '5px 14px',
                              }}
                            >
                              {columns.reduce(
                                (p, c) =>
                                  p +
                                  c.groups.reduce(
                                    (p, c) =>
                                      p +
                                      c.cards.reduce(
                                        (p, c) =>
                                          p +
                                          (c.createdBy === user.userId ? 1 : 0),
                                        0
                                      ),
                                    0
                                  ),
                                0
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ display: 'flex', flexDirection: 'row' }}
                          >
                            {user.feedback && user.feedback.length !== 0 ? (
                              <>
                                FEEDBACK
                                <CheckIcon />
                              </>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                  </Table>
                ),
                [lastStateUpdate]
              )}
            </TableContainer>
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
          </Grid>
        </Box>
      </Box>
    </>
  );
}
