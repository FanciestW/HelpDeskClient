import React from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  loginPaper: {
    padding: '40px 20px',
  }
}));

export default function SignUp() {
  const classes = useStyles();
  return (
    <Grid container
      spacing={0}
      direction='column'
      alignItems='center'
      justify='center'
    >
      <Grid item xs style={{ maxWidth: '100%' }}>
        <Paper className={classes.loginPaper}>
          <Grid container
            spacing={2}
            direction='column'
            alignItems='center'
            justify='center'
            style={{ width: '50vw' }}
          >
            <Grid item xs>
              <Typography variant='h3' component='h3' color='textPrimary'>Sign Up</Typography>
            </Grid>
            <Grid item xs>
              <TextField fullWidth label='First Name' />
            </Grid>
            <Grid item xs>
              <Button>Sign up</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
