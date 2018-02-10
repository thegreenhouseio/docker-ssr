import React from 'react';
import { hydrate, render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import counterApp from './reducers';

// TODO sync store schema across client and server
const defaultState = 0;

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__ || defaultState; // eslint-disable-line no-underscore-dangle

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__; // eslint-disable-line no-underscore-dangle

// Create Redux store with initial state
const store = createStore(counterApp, preloadedState);

// TODO use hydrate if SSR, otherwise use render
const customMount = window.__PRELOADED_STATE__ ? hdyrate : render;

// TODO sync DOM mount point across client and server
customMount(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);