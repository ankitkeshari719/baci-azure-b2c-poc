import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { Alert, Button, Snackbar } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';

export const SnackMessage = () => {
  const [global, dispatch] = React.useContext(GlobalContext);

  const clearMessage = () => {
    dispatch({
      type: ActionType.SET_SNACK_MESSAGE,
      payload: {
        snackMessage: {
          message: '',
          snackMessageType: global.snackMessage?.snackMessageType,
        },
      },
    });
  };



  return (
    <Snackbar
      open={global.snackMessage.message !== ""}
      autoHideDuration={4000}
      onClose={clearMessage}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity= {global.snackMessage?.snackMessageType}>
        {global.snackMessage?.message}
        <Button color="primary" size="small" onClick={clearMessage} 
        // onTouchStart={clearMessage}
        >
          <CloseIcon />
        </Button>
      </Alert>
    </Snackbar>
  );
};
