import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Navbar from '../Navbar/Navbar';
import NotFound from '../NotFound/NotFound';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
}));

const App = (props: AppProps) => {
  const theme = responsiveFontSizes(createMuiTheme({
    palette: {
      type: props.theme || 'light',
    },
  }));
  const classes = useStyles(theme);
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} style={{backgroundColor: theme.palette.background.default}}>
        <Navbar></Navbar>
        <Router>
          <Switch>
            <Route path='/dashboard'>
              <Dashboard />
            </Route>
            <Route path='/404'>
              <NotFound />
            </Route>
            <Redirect to='404' />
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
};

interface AppProps {
  theme?: 'light' | 'dark';
}

export default App;
