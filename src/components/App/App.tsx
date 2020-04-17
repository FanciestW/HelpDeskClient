import React, { useState } from 'react';
import Cookie from 'js-cookie';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Navbar from '../Navbar/Navbar';
import NotFound from '../NotFound/NotFound';
import SignUp from '../SignUp/SignUp';
import Login from '../Login/Login';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
}));

const App = () => {
  const [authed, setAuthed] = useState(localStorage.getItem('authed') === 'true');
  const theme = responsiveFontSizes(createMuiTheme({
    palette: {
      type: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    },
  }));
  const classes = useStyles(theme);
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} style={{backgroundColor: theme.palette.background.default}}>
        <Router>
          <Navbar />
          <Switch>
            <Route path='/dashboard'>
              { authed ? <Dashboard /> : <Redirect to='login' /> }
            </Route>
            <Route path='/signup'>
              { !authed ? <SignUp setAuthed={setAuthed} /> : <Redirect to='dashboard' /> }
            </Route>
            <Route path='/login'>
              { !authed ? <Login setAuthed={setAuthed} /> : <Redirect to='dashboard' /> }
            </Route>
            <Route exact path='/'>
              <Redirect to='dashboard' />
            </Route>
            <Route path='/*'>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
