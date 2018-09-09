// Express dependency is assumed as part of the Docker container
import Express from 'express';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import counterApp from './src/reducers';
import App from './src/containers/App';
import { renderToString } from 'react-dom/server';
import qs from 'qs';

const app = Express(); // eslint-disable-line new-cap
const port = 3001;

// Serve static files
app.use('/static', Express.static('static'));

// This is fired every time the server side receives a request
app.use(handleRender);

// We are going to fill these out in the sections to follow
function handleRender(req, res) {
  const params = qs.parse(req.query);
  const initState = parseInt(params.counter, 10) || 0;

  // Create a new Redux store instance
  const store = createStore(counterApp, initState);

  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Grab the initial state from our Redux store
  const finalState = store.getState();

  // Send the rendered page back to the client
  res.send(renderFullPage(html, finalState));
}

// TODO sync index.html from _src/_ and bundle.js from webpack across client and server
// https://github.com/thegreenhouseio/docker-ssr/issues/1
// https://github.com/thegreenhouseio/docker-ssr/issues/2
function renderFullPage(html, preloadedState) {
  return `
      <!doctype html>
      <html>
      <head>
          <title>Redux Universal Example</title>
      </head>
      
      <body>
          <div id="app">${html}</div>
          <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
          </script>
          <script src="/static/bundle.js"></script>
      </body>
      </html>
  `;
}

app.listen(port, () => {
  console.log(`SSR server started at http://localhost:${port}`); // eslint-disable-line no-console
});