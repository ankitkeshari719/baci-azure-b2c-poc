import * as React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { TopBar } from '../CreateRetro/TopBar';

export default function BusinessAgility() {
  return (
    <>
      <TopBar />
      <Grid container spacing={0} className="retroContainer">
        <Typography>BusinessAgility</Typography>
      </Grid>
    </>
  );
}
