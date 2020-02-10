import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import Dashboard from '../Dashboard/Dashboard';
import Navbar from '../Navbar/Navbar';

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
        <Dashboard></Dashboard>
      </div>
    </ThemeProvider>
  );
};

interface AppProps {
  theme?: 'light' | 'dark';
}

export default App;
