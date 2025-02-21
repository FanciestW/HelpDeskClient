import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import { combineReducers, createStore } from 'redux';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from 'apollo-link-error';
import { authedReducer } from './redux/reducers/AuthedReducer';
import { userReducer } from './redux/reducers/UserReducer';

const rootReducer = combineReducers({
  authedReducer,
  userReducer,
});

const store = createStore(rootReducer);

// GraphQL Client
const GraphQLClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: '/api/graphql',
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'none',
    },
    mutate: {
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    }
  }
});

onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ApolloProvider client={GraphQLClient}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
