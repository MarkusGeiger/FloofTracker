import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import configureHistory from './components/ConfigureHistory';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const history = configureHistory();
//<a href="https://www.freepik.com/vectors/background">Background vector created by winkimages - www.freepik.com</a>
ReactDOM.render(
  <Auth0Provider
    domain="dev-dxm2pfyx.eu.auth0.com"
    clientId="xyWKPHyP0UHBTgHqI0wqoZCRzzdpnvq6"
    redirectUri={window.location.origin}>
  <Router history={history} basename={baseUrl}>
    <App />
  </Router>
</Auth0Provider>,
  rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
