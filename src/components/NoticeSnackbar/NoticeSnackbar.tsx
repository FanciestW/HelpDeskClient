import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function NoticeSnackbar(props: INoticeSnackbar) {

  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleClose = (_event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={props.duration || 3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={props.severity}>
        { props.message }
      </Alert>
    </Snackbar>
  );
}

export interface INoticeSnackbar {
  severity: 'success' | 'error' | 'warning' | 'info';
  message: string;
  open?: boolean;
  duration?: number | null | undefined;
}
