import * as React from 'react';
import { AppBar, Box, Button, Divider, Grid, Toolbar } from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';
import Typography from '@mui/material/Typography';
import * as Icons from 'heroicons-react';

type Props = {
  selectedTemplate: any;
  closeLearnMoreDialog: () => void;
  handleCustomTemplateDialog: () => void;
  handleSelectClick: (selectedTemplateId: string) => void;
};

export function LearnMore({
  selectedTemplate,
  closeLearnMoreDialog,
  handleCustomTemplateDialog,
  handleSelectClick,
}: Props) {
  // Function to handle the custom button click
  const onClickCustomButton = () => {
    closeLearnMoreDialog();
    handleCustomTemplateDialog();
  };

  return (
    <Box className="mainContainer">
      <TopBar />
      <Grid container spacing={0} className="retroContainer">
        {/* About Template */}
        <Grid item xs={12}>
          <Box component="div" whiteSpace="normal" className="createRetroText">
            About Template
          </Box>
        </Grid>
        {/* App bar */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <AppBar position="static" className="learnMoreAppBar">
            <Toolbar
              variant="dense"
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '0px !important',
              }}
            >
              <Icons.ArrowCircleLeftOutline
                size={20}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'block',
                  right: '0px',
                  color: '#159ADD',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
                onClick={closeLearnMoreDialog}
              />
              <Typography
                sx={{ ml: 1, flex: 1 }}
                component="div"
                className="selectedTemplate"
              >
                Sailboat
              </Typography>
              <Button
                autoFocus
                variant="outlined"
                className="customizeButton"
                onClick={onClickCustomButton}
              >
                <Typography className="customizeButtonText" component="span">
                  Customize
                </Typography>
              </Button>
              <Button
                autoFocus
                variant="contained"
                className="saveButton"
                sx={{ ml: 2 }}
                onClick={() => handleSelectClick(selectedTemplate.templateId)}
              >
                <Typography className="saveButtonText" component="span">
                  Select
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>
        </Grid>
        {/* Text one */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Box
            component="div"
            whiteSpace="normal"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span className="text_one">This is a for </span>
            <span className="text_two">&nbsp;classic template</span>
            <span className="text_one">&nbsp;retros</span>.
          </Box>
        </Grid>
        {/* Text two */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Box
            component="div"
            whiteSpace="normal"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span className="text_one">It’s straight to the point to</span>
            <span className="text_two">&nbsp;reflect</span>
            <span className="text_one">&nbsp;on the team’s</span>
            <span className="text_two">&nbsp;performance</span>.
          </Box>
        </Grid>
        {/* Divider */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Divider />
        </Grid>
        {/* One */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <Typography className="aboutTemplate" component="div">
            About Simple (Default)
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            The simplest template to do your retro. So easy that we have made
            this our default template.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{ mt: 4 }}
            component="img"
            alt="Logo"
            src="/images/LearnMoreTwo.png"
          />
        </Grid>
        {/* Two */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{ mt: 4 }}
            component="img"
            alt="Logo"
            src="/images/LearnMoreFour.png"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <Typography className="aboutTemplate" component="div">
            What Went Well
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            Embrace the positives!
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            Share thoughts on the ‘wins’ and recognise individual or team
            achievements. Focus on the positives to energise the team and share
            awareness on strengths and capabilities.
          </Typography>
        </Grid>
        {/* Three */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <Typography className="aboutTemplate" component="div">
            What Didn’t Go Well
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            Team members share aspects of work that could improve. The mindset
            to this section is simply to find quick resolutions to any problem
            areas for the better of the team.
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            Sharing and discussing this encourages open and honest collaboration
            and teamwork.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{ mt: 4 }}
            component="img"
            alt="Logo"
            src="/images/LearnMoreOne.png"
          />
        </Grid>
        {/* Four */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{ mt: 4 }}
            component="img"
            alt="Logo"
            src="/images/LearnMoreThree.png"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <Typography className="aboutTemplate" component="div">
            Develop Actions
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            Identifying actions for the team to improve.
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            Typically, the team focuses on actions to resolve their most
            significant “What Didn’t Go Well”. Actions can however also be
            targeted at further celebrating the “What Did Go Well”, like getting
            Sarah to do another presentation 😉.
          </Typography>
          <Typography
            className="templateDescription"
            component="div"
            sx={{ mt: 2 }}
          >
            Don’t forget to assign the action for a team member to complete.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
