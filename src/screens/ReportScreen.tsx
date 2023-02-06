import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useMediaQuery,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { BoardContext } from '../contexts/BoardContext';
import { GlobalContext } from '../contexts/GlobalContext';
import React, { useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { Report } from '../elements/Report';
import { UserAvatar } from '../atoms/UserAvatar';
import theme from '../theme/theme';
import useLoadRetro from '../hooks/useLoadRetro';
import { Navigate, useNavigate } from 'react-router-dom';
import { ActionType } from '../contexts/GlobalContext';

export default function ReportScreen() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const reset = () => {
    dispatch({ type: ActionType.CLOSE_CURRENT_RETRO });
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: true },
    });

    navigate('/');
  };
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [open, setOpen] = React.useState(false);
  const [{ user, currentRetro }] = React.useContext(GlobalContext);
  const {
    state: { loading, creatorId, retroName, users, retroId, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const [retroDate, setRetroDate] = React.useState('');
  const componentRef = React.createRef<HTMLDivElement>();
  const navigate = useNavigate();

  React.useEffect(() => {
    const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
    setRetroDate(longEnUSFormatter);
    // console.log(longEnUSFormatter, typeof(longEnUSFormatter));
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: any) => {
    setOpen(false);
    if (value) {
      reset();
    }
  };

  return (
    <Box
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Report ref={componentRef} />
    </Box>
  );
}
