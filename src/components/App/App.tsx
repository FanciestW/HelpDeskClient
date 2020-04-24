import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, responsiveFontSizes, createMuiTheme, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { IRootReducer } from '../../redux/IRootReducer';
import Dashboard from '../Dashboard/Dashboard';
import TicketView from '../TicketView/TicketView';
import NewTicketView from '../NewTicketView/NewTicketView';
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
      < CssBaseline />
      <div className={classes.root} style={{ backgroundColor: theme.palette.background.default }}>
        <Router>
          <ApolloProvider client={GraphQLClient}>
            {isAuthed ? <Navbar /> : null}
            <Switch>
              <Route path='/dashboard'>
                { isAuthed ? <Dashboard /> : <Redirect to='/login' /> }
              </Route>
              <Route path='/tickets/test'>
                { isAuthed ? <TicketView /> : <Redirect to='/login' /> }
              </Route>
              <Route path='/ticket/new'>
                { isAuthed ? <NewTicketView /> : <Redirect to='/login' /> }
              </Route>
              <Route path='/login'>
                { !isAuthed ? <Login /> : <Redirect to='/dashboard' /> }
              </Route>
              <Route path='/signup'>
                { !isAuthed ? <SignUp /> : <Redirect to='/dashboard' /> }
              </Route>
              <Route exact path='/'>
                <Redirect to='/dashboard' />
              </Route>
              <Route path='/*' component={NotFound} />
            </Switch>
          </ApolloProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
