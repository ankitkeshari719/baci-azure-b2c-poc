import { Typography, Box, Button } from '@mui/material';
import React from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

const SessionEndingMessage = ({
  isXsUp,
  hideSessionEndingMessage,
}: {
  isXsUp: boolean;
  hideSessionEndingMessage: (event: any) => void;
}) => {
  const [global, dispatch] = React.useContext(GlobalContext);
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: '2',
        top: '0',
        right: isXsUp ? 0 : '140px',
        background: '#EE7538',
        borderRadius: '0px 0px 20px 20px',
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
        color: 'white',
        fontWeight: '400',
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column',
        width: '280px',
        padding: '18px',
        paddingTop: '10px',
        alignItems: 'end',
      }}
    >
      <Button
        variant="contained"
        sx={{
          // background: '#159ADD',
          // color: 'white',
          borderRadius: '24px',
          width: '148px',
          height: '44px',
          // padding: '10px 20px',
          // marginRight: '40px',
          fontWeight: 500,
          filter: 'blur(3px)',
        }}
      >
        LEAVE RETRO
      </Button>
      {/* </Box> */}
      <Typography
        sx={{
          fontWeight: '600',
          fontSize: '18px',
          marginBottom: '16px',
          marginTop: '24px',
        }}
      >
        The session is ending soon!
      </Typography>
      <Typography align="right">
        Consider finalising actions and hitting{' '}
        {global.user.userType == 2 ? 'FINISH RETRO' : 'LEAVE RETRO'} button.
      </Typography>
      <Typography
        // type="button"
        onClick={hideSessionEndingMessage}
        // onTouchStart={hideSessionEndingMessage}
        sx={{
          textDecorationLine: 'underline',
          marginTop: '18px',
          cursor: 'pointer',
          zIndex: '1000',
        }}
      >
        Got It
      </Typography>
    </div>
  );
};

export default SessionEndingMessage;
