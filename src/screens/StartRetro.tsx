import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  Link,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import { LandingLayout } from './LandingLayout';
import commonStyles from './../style.module.scss';
import './../global.scss';
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useRetro } from '../helpers';

import email from '../assets/img/emailbox.png';
import { Email, EmailOutlined } from '@mui/icons-material';
import { GlobalContext } from '../contexts/GlobalContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import * as Icons from 'heroicons-react';
import StartRetroButton from '../elements/StartRetroButton';
import Toolbar from '../elements/Toolbar';
import useLoadRetro from '../hooks/useLoadRetro';
import { EmailShareButton, WhatsappShareButton } from 'react-share';
import theme from '../theme/theme';
const styles = {
  frame101: {
    marginTop: '48px',
    marginBttom: '259px',
  },
  group100: {
    marginTop: '60px',
  },
  nowAvailableAt: {
    height: '20px',
    fontFamily: "'Poppins'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    opacity: '0.5',
  },
  displayCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    color: commonStyles.PrimaryMain,
  },
  shareImg: {},
  group99: {
    marginTop: '60px',
    display: 'inline',
  },
  copyImg: {
    marginBottom: '17.5px',
  },
  emailImg: {
    width: '96px',
    height: '96px',
  },
  group95: {
    marginTop: '27.5px',
    marginBottom: '104px',
    background: '#FFFFFF',
    height: '177px',
    display: 'inline-block',
    width: '100%',
  },
  group96: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    width: '375px',
    height: '375px',
    top: '39.07%',
    bottom: '27.87%',
    background: '#FFFFFF',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
  },
  group97: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    top: '39.07%',
    bottom: '27.87%',
    background: '#FFFFFF',
    width: '375px',
    height: '375px',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
  },
  group98: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    top: '39.07%',
    bottom: '27.87%',
    width: '375px',
    height: '375px',
    background: '#FFFFFF',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
  },
  div95: {
    marginTop: '48.75px',
    marginBottom: '17.5px',
    marginLeft: '46%',
  },
  div96: {
    marginTop: '60.75px',
    marginBottom: '17.5px',
    marginLeft: '46%',
  },
  div97: {
    // marginTop: '27.75px',
    // marginBottom: '17.5px',
  },
  div98: {
    // marginTop: '19.12px',
    // marginBottom: '17.5px',
  },
  joinurl: {
    color: commonStyles.primaryDark,
    width: '153px',
  },
  qrCode: {
    width: '80px',
    height: '80px',
  },
  goToRetroBtn: {
    height: '44px',
    marginTop: '44px',
  },
  copyURL: {
    height: '36px',
  },
};
export function StartRetro() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [iscopied, setIsCopied] = React.useState(false);
  const navigate = useNavigate();
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const shareData = {
    title: 'Retro',
    text: 'Join the retro',
    url: global.currentRetro?.joinUrl,
  };

  const shareRetroDetails = () => {
    // navigator.share(shareData);
    navigator.share(shareData);
  };
  const canShare = navigator.canShare && navigator.canShare(shareData);
  useLoadRetro();
  function goToRetro() {
    navigate('/join/' + global?.currentRetro?.humanId);
  }
  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', 'QR.png');
      const dataURL = canvas.toDataURL('image/png');
      const url = dataURL.replace(
        /^data:image\/png/,
        'data:application/octet-stream'
      );
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    }
  };
  const handleTooltipClose = () => {
    setIsCopied(false);
  };
  return (
    <Grid container spacing={0}>
      <Grid xs={12} item>
        <Toolbar></Toolbar>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
        pr={commonStyles.m_80}
        pl={commonStyles.m_80}
      >
        <Box style={styles.frame101}>
          <Typography
            variant="h2"
            color={commonStyles.primaryDark}
            className="alignCenter"
          >
            ‘{global.currentRetro?.name}’ retro is created successfully!
          </Typography>
          <Box style={styles.group100}>
            <Box style={styles.displayCenter}>
              <Button sx={styles.nowAvailableAt}>now available at</Button>
            </Box>
            <Box style={styles.displayCenter}>
              {' '}
              <a
                href="https://baci.app"
                rel="noreferrer"
                target="_blank"
                style={styles.link}
              >
                https://baci.app
              </a>
            </Box>
          </Box>
          <Box sx={styles.group99}>
            <div style={styles.displayCenter}>
              <Typography color={commonStyles.primaryDark}>
                WITH CODE
              </Typography>
            </div>
            <div style={styles.displayCenter}>
              <Typography
                variant="h2"
                display="block"
                color={commonStyles.primaryDark}
                style={{
                  margin: '12px 0px 0px 0px',
                  width: '185px',
                  textAlign: 'center',
                }}
              >
                {global?.currentRetro?.humanId}
              </Typography>
            </div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                marginTop: '70px',
              }}
            >
              <Box sx={styles.group96}>
                <Box
                  style={styles.joinurl}
                  height="70%"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <a style={{ overflowWrap: 'break-word' }}>
                    {global?.currentRetro?.joinUrl}
                  </a>
                </Box>
                <Box>
                  <CopyToClipboard
                    text={global?.currentRetro?.joinUrl}
                    onCopy={() => setIsCopied(true)}
                  >
                    <Tooltip
                      onClose={handleTooltipClose}
                      open={iscopied}
                      style={{ width: '20px', fontSize: '10px' }}
                      disableTouchListener
                      leaveDelay={1500}
                      placement="top"
                      title="Link Copied!"
                    >
                      <Button
                        variant="outlined"
                        className="primaryButton"
                        startIcon={<Icons.Link size={20} />}
                        style={styles.copyURL}
                      >
                        <span className="primaryButtonText">Copy URL</span>
                      </Button>
                    </Tooltip>
                  </CopyToClipboard>
                </Box>
              </Box>

              <Box sx={styles.group97}>
                <Box
                  height="70%"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <QRCode
                    value={global.currentRetro?.joinUrl || ''}
                    style={styles.qrCode}
                  />
                </Box>

                <div style={styles.div97}>
                  <Button
                    variant="outlined"
                    className="primaryButton"
                    startIcon={<Icons.Qrcode size={20} />}
                    style={styles.copyURL}
                    onClick={downloadQRCode}
                    // onTouchStart={downloadQRCode}
                  >
                    <span className="primaryButtonText">download qr code</span>
                  </Button>
                </div>
              </Box>

              {/* {canShare && ( */}
              <Box sx={styles.group98}>
                <Box
                  height="70%"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img src={email} alt="email" style={styles.emailImg} />
                </Box>
                <div style={styles.div98}>
                  <EmailShareButton
                    url={global.currentRetro?.joinUrl + ''}
                    style={{
                      color: '#159ADD',
                      fontSize: '16px',
                      fontWeight: '500',
                      borderRadius: '24px',
                      letterSpacing: '0.4',
                      border: '1px solid rgba(21, 154, 221, 0.5)',
                      height: '36px',
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Icons.Link size={20} style={{ marginRight: '8px' }} />
                    INVITE VIA EMAIL
                  </EmailShareButton>
                </div>
              </Box>
              {/* )} */}
            </Box>
          </Box>
          <Box
            display="flex"
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <StartRetroButton />
            {/* <Button
              variant="outlined"
              className="secondaryButton"
              style={styles.goToRetroBtn}
              onClick={() => goToRetro()}
            >
              <span className="secondaryButtonText">Start retro</span>
            </Button> */}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
