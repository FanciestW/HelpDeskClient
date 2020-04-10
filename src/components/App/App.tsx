import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Navbar from '../Navbar/Navbar';
import NotFound from '../NotFound/NotFound';
import SignUp from '../SignUp/SignUp';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
}));

const App = () => {
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
              <Dashboard />
            </Route>
            <Route path='/signup'>
              <SignUp />
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
