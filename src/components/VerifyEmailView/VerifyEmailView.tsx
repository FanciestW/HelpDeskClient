import React from 'react';
import { Button, Grid, Paper, Typography, makeStyles } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ErrorIcon from '@material-ui/icons/Error';


const useStyles = makeStyles(() => ({
  messageDiv: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  header: {
    flex: 1,
    margin: '20px 0px 10px 0px',
  },
  subtitle: {
    flex: 1,
    margin: '0px 0px 10px 0px'
  },
  statusIcon: {
    margin: '0 auto',
    display: 'block',
  },
  paperBox: {
    minWidth: 500,
    padding: 30,
  },
}));

export default function VerifyEmailView(props: IVerifyEmailViewProps) {
  const classes = useStyles();
  const userAuthed = localStorage.getItem('authed') === 'true';
  const content = props.valid ? 
    (
      <div className={classes.messageDiv}>
        <VerifiedUserIcon fontSize='large' className={classes.statusIcon} />
        <Typography variant='h5' className={classes.header}>
          Your Email has been Verified!
        </Typography>
        <Button variant='contained' color='primary' href={userAuthed ? '/dashboard' : '/login'}>
          { userAuthed ? 'Go to Dashboard' : 'Login'}
        </Button>
      </div>
    ) :
    (
      <div className={classes.messageDiv}>
        <ErrorIcon fontSize='large' className={classes.statusIcon} />
        <Typography variant='h5' className={classes.header}>
          Sorry...This Link is Bad
        </Typography>
        <Typography variant='subtitle1' className={classes.subtitle}>
          Please sign to your account to resend the verification Email
        </Typography>
        <Button variant='contained' color='primary' href='/login'>
          Login
        </Button>
      </div>
    );
  return (
    <Grid container
      spacing={0}
      direction='column'
      alignItems='center'
      justify='center'
      style={{ minHeight: '90vh' }}
    >
      <Grid item>
        <Paper className={classes.paperBox} elevation={2}>
          {content}
        </Paper>
      </Grid>
    </Grid>
  );
}

interface IVerifyEmailViewProps {
  valid: boolean;
}
