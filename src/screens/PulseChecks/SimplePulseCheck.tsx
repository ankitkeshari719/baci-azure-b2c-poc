import * as React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { TopBar } from '../CreateRetro/TopBar';

export default function SimplePulseCheck() {
  return (
    <>
      <TopBar />
      <Grid container spacing={0} className="retroContainer">
        <Typography>SimplePulseCheck</Typography>
      </Grid>
    </>
  );
}
