import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './redux-store';
import { fetchUserIds } from './thunks'
import { App } from './components.jsx'

import "./index.css";


/**
 *
 * App initialization
 *
 */
const rootElement = document.getElementById('root')


const RETRIES = 4;
const RETRY_DELAY = 10000;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry(fn, i, n) {
  store.dispatch(fn()).then(async (err) => {
    if(err.type === 'fetch_users_error') {
      if(i === n) {
        console.error(`Failed retrying ${n} times`);
      } else {
        await delay(RETRY_DELAY);
        retry(fn, i+1, n)
      }
    }
  })
}


retry(fetchUserIds, 0, RETRIES)
//store.dispatch(fetchUserIds())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)

