import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const AuthedRoute = ({ component: Component, authed, ...rest }: any) => (
  <Route {...rest} render={(props) => (
    authed === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);

AuthedRoute.propTypes = {
  component: PropTypes.object,
  authed: PropTypes.bool,
};

export default AuthedRoute;