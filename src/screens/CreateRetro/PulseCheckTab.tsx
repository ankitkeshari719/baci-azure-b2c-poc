import * as React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CardActions,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Slider from 'react-slick';

import { pulseChecksData, pulseCheckInterface } from './const';
import { ContainedButton, OutlinedButton } from '../../components';
import * as Icons from 'heroicons-react';

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Icons.ChevronRight
      size={32}
      className={className}
      style={{
        ...style,
        display: 'block',
        right: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Icons.ChevronLeft
      size={32}
      className={className}
      style={{
        ...style,
        display: 'block',
        left: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    />
  );
}

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  className: 'center',
  centerMode: true,
  swipeToSlide: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

type Props = {
  activePanel: string;
  selectedPulseCheck: pulseCheckInterface | null;
  onClickBack: (previousPanel: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  handlePulseCheck: (selectedPulseCheck: pulseCheckInterface) => void;
};

export function PulseCheckTab({
  activePanel,
  selectedPulseCheck,
  onClickNext,
  onClickBack,
  handlePulseCheck,
}: Props) {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  return (
    <>
      {/* Template Panel */}
      <Box sx={{ borderBottom: 1, borderColor: '#CCCCCC', py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {activePanel != 'pulseCheckPanel' && selectedPulseCheck != null ? (
            <>
              <Box
                className="tabSummary"
                sx={{
                  color: '#4E4E4E !important',
                }}
              >
                {selectedPulseCheck?.name + ' Pulse Check'}
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'pulseCheckPanel'
                    ? '#2c69a1 !important'
                    : '#4E4E4E !important',
              }}
            >
              Pulse Check Layout
            </Typography>
          )}
        </Box>
        {activePanel === 'pulseCheckPanel' && (
          <Box sx={{ mt: 4 }}>
            <>
              <Slider {...settings}>
                {pulseChecksData.map(pulseCheck => {
                  return (
                    <Card
                      key={pulseCheck.id}
                      sx={{
                        maxWidth: '420px',
                        height: '400px',
                        background: '#ffffff',
                        border: '1px solid #E3E3E3',
                        boxShadow: 'none',
                        borderRadius: '2px',
                        margin: '8px',
                        '&:hover': {
                          backgroundColor: 'rgba(206, 239, 255, 0.4)',
                        },
                      }}
                      onClick={() => handlePulseCheck(pulseCheck)}
                    >
                      <CardContent>
                        {pulseCheck.checked ? (
                          <Box component="div" className="imageContainer">
                            <Box
                              component="img"
                              alt="Logo"
                              src={pulseCheck.pulseCheckImage}
                              className="imageMain"
                            />
                            <Icons.CheckCircle
                              size={20}
                              color="#159ADD"
                              style={{
                                width: '24px',
                                height: '24px',
                              }}
                              className="imageChild_1"
                            />
                          </Box>
                        ) : (
                          <Box component="div" className="imageContainer">
                            <Box
                              component="img"
                              alt="Logo"
                              src={pulseCheck.pulseCheckImage}
                              className="imageMain"
                            />
                            <Box
                              component="img"
                              width="18px"
                              height="18px"
                              alt="Logo"
                              src="/images/empty_circle.png"
                              className="imageChild_2"
                            />
                          </Box>
                        )}
                        <Typography
                          className="templateName"
                          component="div"
                          sx={{ mt: 2 }}
                        >
                          {pulseCheck.name}
                        </Typography>
                        <Typography
                          className="templateDescription"
                          component="div"
                          sx={{ mt: 2 }}
                        >
                          {pulseCheck.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ padding: '16px' }}>
                        <Button size="small" sx={{ padding: '0px' }}>
                          <Typography className="templateLink">
                            Learn More
                          </Typography>
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })}
              </Slider>
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
                  name="Next"
                  onClick={() =>
                    onClickNext('pulseCheckPanel', 'userDetailPanel')
                  }
                  style={{
                    mt: 5,
                    minWidth: '75px !important',
                    height: '36px !important',
                  }}
                />
                <OutlinedButton
                  name="Back"
                  onClick={() => onClickBack('templatePanel')}
                  style={{
                    minWidth: '75px !important',
                    height: '36px !important',
                    mt: 5,
                  }}
                />
              </Box>
            </>
          </Box>
        )}
      </Box>
    </>
  );
}
