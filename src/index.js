import React from 'react';
import ReactDOM from 'react-dom';

import Web3 from 'web3';
import Web3Provider from 'web3-react';
import { connectors } from 'ui/utils/web3-connector';

import './index.css';
import App from 'ui/app';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Web3Provider connectors={connectors}>
    <App />
  </Web3Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
