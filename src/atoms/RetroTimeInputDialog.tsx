import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { FEATURE_FLAGS_SET } from '../constants/FeatureFlags';
export interface RetroTimeInputDialogProps {
  open: boolean;
  selectedValue: any;
  onSubmit: (value: any) => void;
  onClose: (value: string) => void;
}
const RetroTimeInputDialog = (props: RetroTimeInputDialogProps) => {
  const { onClose, onSubmit, selectedValue, open } = props;
  const [endEpochTime, setEndEpochTime] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState('');
  const currentEpoch = Date.now();
  const handleClose = () => {
    onClose(selectedValue);
  };

  function formatAMPM(date: any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const getValueInMinutes = () => {};
  const getCurrentTimeInEpoch = (flag: boolean) => {
    const epochTime = Date.now();
    const endEpochTime = epochTime + 60 * 60 * 1000;
    const dateTime = new Date(endEpochTime);
    const currentTime = new Date(epochTime);
    if (flag) return endEpochTime;


    // setMinTime(currentTime.getHours()+":"+currentTime.getMinutes())
    const hr =
      dateTime.getHours() < 10
        ? '0' + dateTime.getHours()
        : dateTime.getHours() + '';
    const min =
      dateTime.getMinutes() < 10
        ? '0' + dateTime.getMinutes()
        : dateTime.getMinutes() + '';


    return hr + ':' + min;
  };
  React.useEffect(() => {
    setCurrentTime(formatAMPM(new Date()));
    setEndEpochTime(+getCurrentTimeInEpoch(true));
  }, []);
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
        When this retro will end?
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: '400!important',
          color: '#EE7538',
          fontStyle: 'normal',
          lineHeight: '18px',
          marginTop: '5px',
        }}
      >
        Participants will get a reminder 5 minutes before the retro ends
      </Typography>

      <DialogContent sx={{ marginTop: '50px', marginBottom: '30px' }}>
        <FormControl
          sx={{ m: 1 }}
          variant="standard"
          error={currentEpoch > endEpochTime}
        >
          <InputLabel htmlFor="standard-adornment-amount">
            Select End Time
          </InputLabel>
          <Input
            // sx={{ minWidth: '220px' }}
            id="time"
            type="time"
            //   InputProps={{sx:{width:'200px'}}}
            defaultValue={getCurrentTimeInEpoch(false)}
            onChange={(event: any) => {
            
              const current = new Date();
              const hr = event.target.value.split(':');
              current.setHours(hr[0]);
              current.setMinutes(hr[1]);
              setEndEpochTime(current.getTime());
            
            }}
          />
          {currentEpoch > endEpochTime && (
            <FormHelperText sx={{ color: 'orange' }}>
              Please select end time greater than{' '}
              {formatAMPM(new Date(currentEpoch))}
            </FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            padding: '10px 20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
          }}
          onClick={() => onSubmit(endEpochTime)}
          // onTouchStart={()=>onSubmit(endEpochTime)}
        >
          START RETRO
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RetroTimeInputDialog;
