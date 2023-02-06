import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

const LeaveRetroDialog = (props: any) => {
  const { onClose, open } = props;
  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          width: '700px',
          maxHeight: '600px',
          padding: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          
        },
        }}
      sx={{'&& .MuiDialog-paper': {overflowX: 'hidden'}}}
    >
      <img
        onClick={handleClose}
        // onTouchStart={handleClose}
        style={{
          position: 'absolute',
          right: '20px',
          top: '10px',
          cursor: 'pointer',
        }}
        src="/svgs/CloseDialog.svg"
      ></img>
      <Typography
        sx={{ fontSize: '24px', fontWeight: '500', color: '#EE7538' }}
      >
        Are you done with the retro?
      </Typography>

      <DialogContent sx={{ marginTop: '30px', marginBottom: '30px' }}>
        <Typography sx={{ fontSize: '20px' }} align="center">
          In case of any doubts, please confirm with facilitator before leaving
        </Typography>
      </DialogContent>
      <DialogActions sx={{display:"flex",flexDirection:'column',alignItems:'center'}}>
        <Button
          variant="contained"
          sx={{
            padding: '10px 20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
            width:'200px'
          }}
          onClick={() => onClose(true)}
          // onTouchStart={()=>onClose(true)}
        >
          LEAVE RETRO
        </Button>
        <Button
          variant="outlined"
          sx={{
            padding: '10px 20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
            width:'200px',
            marginTop:'20px'
          }}
          onClick={() => handleClose()}
          // onTouchStart={()=>handleClose()}
        >
          BACK TO BOARD
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveRetroDialog;
