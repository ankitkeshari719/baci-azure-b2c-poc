import * as React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Dialog,
  FormHelperText,
  CardActions,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Slider from 'react-slick';
import { templatesData } from './const';
import { settings } from './SliderConst';
import { LearnMore } from './LearnMore';
import { ContainedButton } from '../../components/ContainedButton';
import { OutlinedButton } from '../../components/OutlinedButton';
import { CustomizeTemplate } from './CustomizeTemplate';
import * as Icons from 'heroicons-react';

type Props = {
  activePanel: string;
  selectedTemplate: any;
  templates: any;
  handleCheckedTemplate: (selectedPulseCheck: any) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
  handleSelectClick: (selectedTemplateId: string) => void;
};

export function RetroTemplateTab({
  activePanel,
  selectedTemplate,
  handleCheckedTemplate,
  onClickNext,
  onClickBack,
  handleSelectClick,
  templates,
}: Props) {
  const [openLearnMoreDialog, setOpenLearnMoreDialog] = React.useState(false);
  const [openCustomTemplateDialog, setOpenCustomTemplateDialog] =
    React.useState(false);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  // Learn More Dialog Open / Close
  const handleLearnMoreDialog = () => {
    setOpenLearnMoreDialog(true);
  };

  const closeLearnMoreDialog = () => {
    setOpenLearnMoreDialog(false);
  };

  // Custom Template Dialog Open / Close
  const handleCustomTemplateDialog = () => {
    setOpenCustomTemplateDialog(true);
  };

  const closeCustomTemplateDialog = () => {
    setOpenCustomTemplateDialog(false);
  };

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
          {activePanel != 'templatePanel' && selectedTemplate != null ? (
            <>
              <Box
                className="tabSummary"
                sx={{
                  color: '#4E4E4E !important',
                }}
              >
                {selectedTemplate?.templateName + ' Retro Template'}
              </Box>
              {/* <Box
                className="timeFrameSummary"
                sx={{
                  color: '#4E4E4E !important',
                  ml: 5,
                }}
              >
                Customized
              </Box> */}
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'templatePanel'
                    ? '#2c69a1 !important'
                    : '#4E4E4E !important',
              }}
            >
              Retro Template
            </Typography>
          )}
        </Box>
        {activePanel === 'templatePanel' && (
          <Box sx={{ mt: 4 }}>
            <>
              <Slider {...settings}>
                {templatesData.map(template => {
                  return (
                    <Card
                      key={template.templateId}
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
                      onClick={() => handleCheckedTemplate(template)}
                    >
                      <CardContent>
                        {template.checked ? (
                          <Box component="div" className="imageContainer">
                            <Box
                              component="img"
                              alt="Logo"
                              src={template.templateImage}
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
                              src={template.templateImage}
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
                          {template.templateName}
                        </Typography>
                        <Typography
                          className="templateDescription"
                          component="div"
                          sx={{ mt: 2 }}
                        >
                          {template.templateDescription}
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{
                          position: 'absolute',
                          bottom: '20px',
                          width: '388px',
                          padding: '16px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flex: '1 0 auto',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            mt: 5,
                          }}
                        >
                          <Button
                            size="small"
                            onClick={handleLearnMoreDialog}
                            sx={{ padding: '0px' }}
                          >
                            <Typography className="templateLink">
                              Learn More
                            </Typography>
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            className="customButton"
                            onClick={handleCustomTemplateDialog}
                          >
                            <Typography className="customText">
                              Customize
                            </Typography>
                          </Button>
                        </Box>
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
                    onClickNext('templatePanel', 'pulseCheckPanel')
                  }
                  style={{
                    mt: 5,
                    minWidth: '75px !important',
                    height: '36px !important',
                  }}
                />
                <OutlinedButton
                  name="Back"
                  onClick={() => onClickBack('detailsPanel')}
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
      <Dialog
        fullScreen
        open={openLearnMoreDialog}
        onClose={closeLearnMoreDialog}
      >
        <LearnMore
          selectedTemplate={selectedTemplate}
          closeLearnMoreDialog={closeLearnMoreDialog}
          handleCustomTemplateDialog={handleCustomTemplateDialog}
          handleSelectClick={handleSelectClick}
        />
      </Dialog>
      <Dialog
        fullScreen
        open={openCustomTemplateDialog}
        onClose={closeCustomTemplateDialog}
      >
        <CustomizeTemplate
          closeCustomTemplateDialog={closeCustomTemplateDialog}
          selectedTemplate={selectedTemplate}
          handleSelectClick={handleSelectClick}
        />
      </Dialog>
    </>
  );
}
