import React, { useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import Unit from './pages/Unit/Unit';
import Order from './pages/Order/Order';
import LoginForm from './pages/Login/LoginForm';
import Navbar from './components/Navbar/Navbar';
import PostInfo from './pages/Posts/PostInfo';
import OrderChart from './pages/OrderChart/OrderChart';
import Spinner from './components/Spiner/Spinner';
import './App.css';

const LOGIN = loader('./LOGIN.graphql');

function App({ history }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [getLogin, { loading }] = useLazyQuery(LOGIN, {
    onCompleted: ({ login: { user, token } }) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      setUser(user);
      history.push(`/unit/${user.unit}`);
    }
  });

  const client = useApolloClient();

  const getLoginHandler = (login, password) => getLogin({
    variables: {
      login,
      password
    }
  });

  const handleLogout = () => {
    client.clearStore().then(_ => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      history.push('/login');
    });
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <Spinner/>
    </div>;
  }

  return (
    <div className="App" style={{ padding: '1rem 2rem' }}>
      {user && <Navbar user={user} logout={handleLogout}/>}
      <Switch>
        <Route path='/login' render={() => <LoginForm getLogin={getLoginHandler}/>}/>
        <Route exact path='/unit/:unitId/posts/:postId/orderChart' component={OrderChart}/>
        <Route exact path='/unit/:unitId/posts/:postId' component={PostInfo}/>
        <Route exact path='/unit/:unitId' component={Unit}/>
        <Route exact path='/order' component={Order}/>
      </Switch>
    </div>
  );
}

export default withRouter(App);