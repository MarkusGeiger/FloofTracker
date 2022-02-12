import React from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';

import 'antd/dist/antd.dark.css';
import './custom.css'
import { Loading } from './components/Loading';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import AuthWrapper from './components/AuthWrapper';

const App = () => {
  const { user } = useAuth0();
  console.log(user);
  return (
    <AuthWrapper>
      <Route exact path='/' component={withAuthenticationRequired(Home, {onRedirecting: () => <Loading />,})}/>
    </AuthWrapper>
  );
}

export default App;