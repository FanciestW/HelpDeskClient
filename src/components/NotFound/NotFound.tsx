import React from 'react';
import { Typography, Button, makeStyles } from '@material-ui/core';
import travolta from '../../assets/confused_travolta.gif';

const useStyles = makeStyles((theme) => ({
  goHomeButton: {
    margin: theme.spacing(2),
  }
}));

export default function NotFound() {
  const classes = useStyles();
  return (
    <div style={{textAlign: 'center', padding: '20px'}}>
      <Typography variant='h3' component='h3' color='textPrimary' style={{ zIndex: 0 }}>404</Typography>
      <Typography variant='h4' component='h4' color='textPrimary' style={{ zIndex: 0 }}>Page Not Found</Typography>
      <Button variant='contained' color='primary' className={classes.goHomeButton} href='/'>Go Home</Button>
      <img style={{position: 'fixed', left: 'calc(50% - 238px)', bottom: '0px', zIndex: 1 }} src={travolta} alt="Sorry..." />
    </div>
  );
}