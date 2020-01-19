import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
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

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [getLogin, {loading, data}] = useLazyQuery(LOGIN);

  const client = useApolloClient();

  const getLoginHandler = (login, password) => {
    getLogin({
      variables: {
        login,
        password
      }
    })
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    client.clearStore().then();
    setUser(null);
  };

  // todo: bad approach, must use onCompleted
  useEffect(() => {
    if (!data) {
      return;
    }
    const {user, token} = data.login;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUser(user);
  }, [data]);

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', padding: '3rem'}}>
      <Spinner/>
    </div>;
  }

  return (
    <div className="App" style={{padding: '1rem 2rem'}}>
      <Navbar user={user} logout={handleLogout}/>
      {user
        ? <Redirect from='/login' to={`/unit/${user.unit}`}/>
        : <Redirect from='*' to='/login'/>
      }
      <Switch>
        <Route exact path='/' render={() => <div>Please, login</div>}/>
        <Route path='/login' render={() => <LoginForm getLogin={getLoginHandler}/>}/>
        <Route exact path='/unit/:unitId/posts/:postId/orderChart' component={OrderChart}/>
        <Route exact path='/unit/:unitId/posts/:postId' component={PostInfo}/>
        <Route exact path='/unit/:unitId' component={Unit}/>
        <Route exact path='/order' component={Order}/>
      </Switch>
    </div>
  );
}
