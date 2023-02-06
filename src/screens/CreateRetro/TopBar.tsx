import * as React from 'react';
import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material';
import theme from '../../theme/theme';
import BACILogo from '../../assets/img/bacilogo.png';
import Link from '@mui/material/Link';

export function TopBar() {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <AppBar
      position="static"
      className='logoContainer'
    >
      <Toolbar variant="dense" sx={{paddingLeft: '56px !important'}}>
        <Link href="/">
          <Box
            component="img"
            sx={{
              width: isXsUp ? '60px' : '82px',
              height: isXsUp ? '24px' : '28px',
            }}
            alt="Logo"
            src={BACILogo}
          />
        </Link>
      </Toolbar>
    </AppBar>
  );
}
