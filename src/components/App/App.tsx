import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, responsiveFontSizes, createMuiTheme } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { IRootReducer } from '../../redux/IRootReducer';
import { changeAuthed } from '../../redux/actions/AuthedActions';
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

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthed: boolean = useSelector<IRootReducer, boolean>(state => state.authedReducer.isAuthed);

  const setAuthed = (newAuth: boolean) => {
    console.log(`Setting isAuthed to: ${newAuth}`);
    dispatch(changeAuthed(newAuth));
  };

  // Styling
  const theme = responsiveFontSizes(createMuiTheme({
    palette: {
      type: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    },
  }));
  const classes = useStyles(theme);

  // GraphQL Client
  const GraphQLClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: '/api/graphql',
    })
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} style={{ backgroundColor: theme.palette.background.default }}>
        <Router>
          <Navbar setAuthed={setAuthed} />
          <Switch>
            {
              isAuthed ?
                <Route>
                  <ApolloProvider client={GraphQLClient} >
                    <Dashboard />
                  </ApolloProvider>
                </Route>
                : <Redirect to='login' />
            }
            <Route path='/signup'>
              {!isAuthed ? <SignUp /> : <Redirect to='dashboard' />}
            </Route>
            <Route path='/login'>
              {!isAuthed ? <Login /> : <Redirect to='dashboard' />}
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
