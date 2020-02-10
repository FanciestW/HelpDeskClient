import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import Dashboard from '../Dashboard/Dashboard';
import Navbar from '../Navbar/Navbar';

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'light',
  },
}));

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Navbar></Navbar>
        <Dashboard></Dashboard>
      </div>
    </ThemeProvider>
  );
};

export default App;
