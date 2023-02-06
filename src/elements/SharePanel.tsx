import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { BoardContext } from '../contexts/BoardContext';
import CloseIcon from '@mui/icons-material/Close';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GlobalContext } from '../contexts/GlobalContext';
import QRCode from 'qrcode.react';
import React from 'react';
import theme from '../theme/theme';

export default function SharePanel({ onClose }: { onClose: () => void }) {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));

  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: { retroName },
  } = React.useContext(BoardContext);

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
            height: '60%',
            minHeight: '400px',
            width: '100vw',
            ...(isXsUp
              ? {
                  position: 'fixed',
                  right: 0,
                  left: 0,
                  width: '100vw',
                  height: 'var(--app-height)',
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
                    Participation
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
                Participation
              </Typography>
            ) : null}

            <Grid
              sx={{
                flexDirection: 'column',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Grid
                container
                direction={isXsUp ? 'column' : 'row'}
                sx={{
                  maxWidth: '500px',
                  padding: '20px',
                  gap: isXsUp ? '12px' : '0px',
                }}
              >
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bolder' }}>Go to:</Typography>
                  <Typography>
                    {global.currentRetro?.joinUrl
                      ? 'https://' +
                        new URL(global.currentRetro?.joinUrl).hostname
                      : ''}
                  </Typography>
                  <Typography sx={{ fontWeight: 'bolder' }}>
                    Enter the code
                  </Typography>
                  <Typography sx={{ background: '#CDCDD4', padding: '10px' }}>
                    {global.currentRetro?.humanId}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bolder' }}>
                    Or use QR code to join
                  </Typography>
                  <div
                    style={{
                      flexGrow: 2,
                      justifyContent: 'center',
                      display: 'flex',
                    }}
                  >
                    <QRCode value={global.currentRetro?.joinUrl || ''} />
                  </div>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  minWidth: '300px',
                  justifyContent: 'space-evenly',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CopyToClipboard text={global.currentRetro?.joinUrl} onCopy={() => alert("Copied")}>
                    <Button
                      sx={{
                        ':hover': { background: '#159ADD' },
                        background: '#159ADD',
                        color: '#fff',
                      }}
                      variant="outlined"
                    >
                      Copy link
                    </Button>
                  </CopyToClipboard>
                </div>

                <div style={{ flexGrow: 2 }}>
                  <TextField
                    variant="outlined"
                    sx={{
                      input: { background: '#CDCDD4', borderRadius: '7px' },
                      minWidth: '300px',
                      margin: '10px',
                      color: '#4D555A',
                    }}
                    value={global.currentRetro?.joinUrl}
                  />
                </div>
              </Box>
            </Grid>

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
