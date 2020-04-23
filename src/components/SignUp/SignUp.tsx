import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
  Snackbar,
  Container,
  CssBaseline,
  FormControlLabel,
  Link,
  makeStyles,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import { changeAuthed } from '../../redux/actions/AuthedActions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    float: 'right',
  },
}));

export default function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [isTechnician, setIsTechnician] = useState('no');
  const [errorSnackbarIsOpen, setErrorSnackbarIsOpen] = useState(false);

  const handleIsTechnician = (event: any) => {
    setIsTechnician(event.target.value);
  };

  const handleSignUp = async () => {
    // TODO::verify user inputs
    try {
      const signUpData = {
        firstName,
        middleName,
        lastName,
        email,
        password,
        phone,
        company,
        isTechnician,
      };
      const res = await Axios.post('/api/user/signup', signUpData);
      localStorage.setItem('authed', (res.status === 200).toString());
      dispatch(changeAuthed(res.status === 200));
      if (res.status === 200) {
        history.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorSnackbarIsOpen(true);
    }
  };
  
  return (
    <Container component='main' maxWidth='md'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField autoFocus
                name='firstName'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='First Name'
                type='name'
                autoComplete='given-name'
                value={firstName}
                onChange={(event: any) => setFirstName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant='outlined'
                name='middleName'
                fullWidth
                id='middleName'
                label='Middle Name (Optional)'
                type='name'
                autoComplete='additional-name'
                value={middleName}
                onChange={(event: any) => setMiddleName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant='outlined'
                name='lastName'
                required
                fullWidth
                id='lastName'
                label='Last Name'
                type='name'
                autoComplete='family-name'
                value={lastName}
                onChange={(event: any) => setLastName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                type='email'
                value={email}
                onChange={(event: any) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                value={password}
                onChange={(event: any) => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='confirm-password'
                label='Confirm Password'
                type='password'
                id='password-repeat'
                autoComplete='current-password'
                value={confirmPassword}
                onChange={(event: any) => setConfirmPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                fullWidth
                name='phone'
                label='Phone Number (Optional)'
                type='tel'
                id='phone'
                autoComplete='tel'
                value={phone}
                onChange={(event: any) => setPhone(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                fullWidth
                name='company'
                label='Company (Optional)'
                type='name'
                id='company'
                autoComplete='organization'
                value={company}
                onChange={(event: any) => setCompany(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Are You a Technician?</FormLabel>
                <RadioGroup aria-label="isTechnician" name="isTechnician" value={isTechnician} onChange={handleIsTechnician}>
                  <FormControlLabel value="yes" control={<Radio color='primary'/>} label="Yes" />
                  <FormControlLabel value="no" control={<Radio color='primary'/>} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/login' variant='body2'>
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={errorSnackbarIsOpen}
          autoHideDuration={3000}
          onClose={() => setErrorSnackbarIsOpen(false)}
          message="Note archived"
          action={
            <React.Fragment>
              Unable to login, please try again.
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => setErrorSnackbarIsOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    </Container>
  );
}
