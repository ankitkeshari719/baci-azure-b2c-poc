import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';

export default function ErrorDialog() {
  return (
    <>
      <Dialog open={true}>
        <DialogTitle>There has been an error</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center">
            <Typography>Please try again later</Typography>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => location.reload()}
            // onTouchStart={() => location.reload()}
            autoFocus
          >
            Reload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
