import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import LandingImage from '../assets/img/landing_img.png';
import LandingMobileImage from '../assets/img/Mobile_home_Image.png';
import BACILogo from '../assets/img/bacilogo.png';
import commomStyles from './../style.module.scss';
import theme from '../theme/theme';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const styles = {
  mainDiv: {
    backgroundImage: `url(${LandingImage})`,
    top: '5.78%',
    bottom: '15.2%',
  },
  mainDivXs: {
    backgroundImage: `url(${LandingImage})`,
    top: '5.78%',
    bottom: '15.2%',
    height: '33vh',
  },
  paperContainer: {
    height: '100vh',
    borderRadius: '0px',
    top: '4.74%',
    bottom: '15.2%',
    background:
      'linear-gradient(180deg, rgba(1, 13, 19, 0.87) 0%, rgba(3, 19, 28, 0.740375) 23.15%, rgba(101, 200, 250, 0.13) 100%)',
  },
  paperContainerXs: {
    height: '33vh',
    borderRadius: '0px',
    top: '4.74%',
    bottom: '15.2%',
    background:
      'linear-gradient(180deg, rgba(1, 13, 19, 0.87) 0%, rgba(3, 19, 28, 0.740375) 23.15%, rgba(101, 200, 250, 0.13) 100%)',
  },
  slogan: {
    marginLeft: '58px',

    display: 'flex',
  },
  sloganText: {
    fontFamily: 'Poppins',
    fontSize: '36px',
    fontWeight: '500',
    lineHeight: '48px',
    letterSpacing: ' 0.5px',
    color: commomStyles.grey,
    margin: '2px',
  },
  sloganTextGrow: {
    fontFamily: 'Poppins',
    fontSize: '36px',
    fontWeight: '500',
    lineHeight: '48px',
    letterSpacing: ' 0.5px',
    color: commomStyles.secondaryMain,
    margin: '2px',
  },
  logoImage: {
    //position: 'absolute' as 'absolute',
    height: '49.5px',
    marginTop: '53px',
    marginLeft: '58px',
  },
  logoImageXs: {
    //position: 'absolute' as 'absolute',
    height: '42px',
  },
  fullPoint: {
    margin: '2px',
    color: '#EE7538',
    fontSize: '36px',
  },
};

export function LandingLayout() {
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [height, setHeight] = React.useState('');
  React.useEffect(() => {
    setHeight('48vh');
  });
  return (
    <>
      <>
        {isXsUp ? (
          <Box sx={{ position: 'relative' }}>
            <img
              src={LandingMobileImage}
              style={{ width: '100%', height: height }}
            ></img>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                height: '48vh',
                width: '100%',
                top: '0px',
              }}
            >
              <Box>
                <LazyLoadImage
                  style={styles.logoImageXs}
                  alt="logo"
                  // height={image.height}
                  src={BACILogo} // use normal <img> attributes as props
                  // width={image.width}
                />
                {/* <img src={BACILogo} alt="Logo" style={styles.logoImageXs} /> */}
              </Box>
              <Box display="flex" mt="32px">
                <Typography variant="h5" color={commomStyles.grey} mr="6px">
                  Reflect
                </Typography>
                <Typography color={commomStyles.secondaryMain} mr="6px" ml='6px'>
                {'\u002E'}
                </Typography>
                <Typography variant="h5" color={commomStyles.grey} mr="6px" >
                  Gratitude
                </Typography>
                <Typography color={commomStyles.secondaryMain} mr="6px" ml='6px'>
                {'\u002E'}
                </Typography>

                <Typography
                  variant="h5"
                  color={commomStyles.secondaryMain}
                  mr="6px"
                >
                  Action
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            <img
              src={LandingImage}
              style={{ width: '100%', height: '100vh' }}
            ></img>
            <Box sx={{ position: 'absolute', top: '0px', zIndex: 1000 }}>
              <Box>
                <img src={BACILogo} alt="Logo" style={styles.logoImage} />
              </Box>
              <Box display="flex" mt="93px" ml="58px">
                <Typography variant="h1" color={commomStyles.grey} mr="6px">
                  Reflect
                </Typography>
                <Typography
                  color={commomStyles.secondaryMain}
                  mr="6px"
                  ml='6px'
                  fontSize="32px"
                >
                   {'\u002E'}
                </Typography>
                <Typography variant="h1" color={commomStyles.grey} mr="6px">
                  Gratitude
                </Typography>
                <Typography
                  color={commomStyles.secondaryMain}
                  mr="6px"
                  ml='6px'
                  fontSize="32px"
                >
                  {'\u002E'}
                </Typography>

                <Typography
                  variant="h1"
                  color={commomStyles.secondaryMain}
                  mr="6px"
                >
                  Action
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </>
    </>
  );
}
