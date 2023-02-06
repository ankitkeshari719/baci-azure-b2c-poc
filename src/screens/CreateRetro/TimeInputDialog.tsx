import {
  Box,
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
  Typography,
} from '@mui/material';
import React from 'react';
import { ContainedButton } from '../../components';

type Props = {
  isTimeInputDialog: boolean;
  selectedValue: any;
  onSubmit: (value: any) => void;
  onClose: (value: string) => void;
};

export function TimeInputDialog({
  onClose,
  onSubmit,
  selectedValue,
  isTimeInputDialog,
}: Props) {
  const currentEpoch = Date.now();
  const [endEpochTime, setEndEpochTime] = React.useState(0);

  React.useEffect(() => {
    setEndEpochTime(+getCurrentTimeInEpoch(true));
  }, []);

  function formateTime(date: any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const getCurrentTimeInEpoch = (flag: boolean) => {
    const epochTime = Date.now();
    const endEpochTime = epochTime + 60 * 60 * 1000;
    const dateTime = new Date(endEpochTime);
    const currentTime = new Date(epochTime);
    if (flag) return endEpochTime;
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

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={isTimeInputDialog}
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
      <Box>
        <img
          width="45px"
          height="45px"
          onClick={handleClose}
          src="/svgs/CloseDialog.svg"
          style={{
            position: 'absolute',
            right: '20px',
            top: '10px',
            cursor: 'pointer',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mt: 4 }}>
          <Typography className="time_text_one">
            When this retro will end?
          </Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography className="time_text_two">
            Participants will get a reminder 5 minutes before the retro ends
          </Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          <FormControl
            variant="standard"
            error={currentEpoch > endEpochTime}
            sx={{ width: '255px !important' }}
          >
            <InputLabel htmlFor="standard-adornment-amount">
              Select End Time
            </InputLabel>
            <Input
              id="time"
              type="time"
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
              <FormHelperText sx={{ color: '#d32f2f' }}>
                Please select end time greater than{' '}
                {formateTime(new Date(currentEpoch))}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      </Box>
      <Box>
        <ContainedButton
          name="Start Retro"
          onClick={() => onSubmit(endEpochTime)}
          style={{
            mt: 5,
            minWidth: '140px !important',
            height: '36px !important',
          }}
        />
      </Box>
    </Dialog>
  );
}
