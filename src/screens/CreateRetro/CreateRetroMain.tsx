import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { CreateRetroWithTemplatePage } from './CreateRetroWithTemplatePage';
import { TopBar } from './TopBar';
import { ShareParticipants } from './shareParticipants';

export function CreateRetroMain() {
  const [isRetroStart, setIsRetroStart] = React.useState<boolean>(false);

  function handleStartRetro() {
    setIsRetroStart(true);
  }

  return (
    <>
      <Box className="mainContainer">
        <TopBar />
        {isRetroStart ? (
          <Grid
            container
            spacing={0}
            sx={{ height: 'calc(100vh - 64px) !important' }}
          >
            <Grid
              item
              xs={7}
              sx={{
                padding: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <CreateRetroWithTemplatePage
                handleStartRetro={handleStartRetro}
                isRetroStart={isRetroStart}
              />
            </Grid>
            <Grid item xs={5}>
              <ShareParticipants />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={0} className="retroContainer">
            <Grid item xs={12}>
              <CreateRetroWithTemplatePage
                handleStartRetro={handleStartRetro}
                isRetroStart={isRetroStart}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}
