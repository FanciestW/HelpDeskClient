import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, responsiveFontSizes, createMuiTheme, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useLazyQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import { IRootReducer } from '../../redux/IRootReducer';
import Dashboard from '../Dashboard/Dashboard';
import TicketView from '../TicketView/TicketView';
import NewTicketView from '../NewTicketView/NewTicketView';
import TicketDetailView from '../TicketDetailView/TicketDetailView';
import Navbar from '../Navbar/Navbar';
import NotFound from '../NotFound/NotFound';
import SignUp from '../SignUp/SignUp';
import Login from '../Login/Login';
import PeoplesView from '../PeoplesView/PeoplesView';
import RequestsView from '../RequestsView/RequestsView';
import IUser from '../../interfaces/User';
import { updateUser } from '../../redux/actions/UserActions';
import { changeAuthed } from '../../redux/actions/AuthedActions';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
}));

const App: React.FC = () => {

  // Redux
  const isAuthed: boolean = useSelector<IRootReducer, boolean>(state => state.authedReducer.isAuthed);
  const user: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user);
  const dispatch = useDispatch();

  // GraphQL
  const getUserInfoQuery = gql`
    query {
      getUserInfo {
        uid
        firstName
        middleName
        lastName
        email
        phone
        company
        isTechnician
      }
    }
  `;
  const [getUserInfo] = useLazyQuery(getUserInfoQuery, {
    onCompleted: (data: { getUserInfo: IUser }) => {
      const {
        uid,
        firstName,
        middleName,
        lastName,
        email,
        phone,
        company,
        isTechnician
      } = data.getUserInfo;
      const userData = { uid, firstName, middleName, lastName, email, phone, company, isTechnician };
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(updateUser(userData));
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    },
  });

  useEffect(() => {
    getUserInfo();
  }, [isAuthed]);

  // Styling
  const theme = responsiveFontSizes(createMuiTheme({
    palette: {
      type: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    },
  }));
  const classes = useStyles(theme);

  return (
    <ThemeProvider theme={theme}>
      < CssBaseline />
      <div className={classes.root} style={{ backgroundColor: theme.palette.background.default }}>
        <Router>
          {isAuthed ? <Navbar /> : null}
          <Switch>
            <Route path='/dashboard'>
              { isAuthed ? <Dashboard /> : <Redirect to='/login' /> }
            </Route>
            <Route path='/tickets'>
              { isAuthed ? <TicketView /> : <Redirect to='/login' /> }
            </Route>
            <Route path='/ticket/new'>
              { isAuthed ? <NewTicketView /> : <Redirect to='/login' /> }
            </Route>
            <Route path='/ticket/:ticketId'>
              { isAuthed ? <TicketDetailView /> : <Redirect to='/login' /> }
            </Route>
            <Route path='/clients'>
              {
                isAuthed ?
                  user?.isTechnician ? <PeoplesView show='clients' /> : <Redirect to='/technicians' />
                  : <Redirect to='/login' />
              }
            </Route>
            <Route path='/technicians'>
              { isAuthed ? <PeoplesView show='technicians' /> : <Redirect to='/login' /> }
            </Route>
            <Route path='/requests'>
              { isAuthed ? <RequestsView /> : <Redirect to='/login' /> }
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
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
