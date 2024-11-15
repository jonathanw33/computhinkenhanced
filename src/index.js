import React from 'react';
import ReactDOM from 'react-dom/client'; // Keep this import
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css"; 
import './scss/index.scss';
import { Auth0Provider } from '@auth0/auth0-react';

console.log('Environment variables:', {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      audience: `https://dev-yyxwjv0qx8jvs6dy.us.auth0.com/api/v2/`,
      scope: "read:current_user update:current_user_metadata"
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>,
    document.getElementById('root')

);