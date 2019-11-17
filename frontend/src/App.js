import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Order from './components/pages/Order/Order';
import LoginForm from './components/pages/Login/LoginForm';
import Navbar from './components/Navbar/Navbar';
import Employee from './components/pages/Employee/Employee';
import './App.css';
import Posts from './components/pages/Posts/Posts';
import PostInfo from './components/pages/Posts/PostInfo';
import OrderChart from './components/pages/OrderChart/OrderChart';
import UnitContainer from './components/pages/Unit/UnitContainer';
import { gql } from 'apollo-boost';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import Spinner from './components/Spiner/Spinner';

const LOGIN = gql`
  query Login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      user {
        _id
        employee {
          _id
          unit {
            _id
          }
        }
      }
      token
    }
  }
`;

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [getLogin, { loading, data }] = useLazyQuery(LOGIN);

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
    const { user, token } = data.login;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUser(user);
  }, [data]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <Spinner/>
    </div>;
  }

  return (
    <div className="App" style={{ padding: '1rem 2rem' }}>
      <Navbar user={user} logout={handleLogout}/>
      <Switch>
        <Route exact path='/' render={() => <div>Please, login</div>}/>
        <Route path='/login' render={() => <LoginForm getLogin={getLoginHandler}/>}/>
        {user && <React.Fragment>
          <Route path='/unit/:unitId' component={UnitContainer}/>
          <Route path='/unit/:unitId/posts' component={Posts}/>
          <Route path='/unit/:unitId/posts/:postId' component={PostInfo}/>
          <Route path='/unit/:unitId/posts/:postId/orderChart' component={OrderChart}/>
          <Route path='/employee/:id' component={Employee}/>
          <Route path='/order' component={Order}/>
        </React.Fragment>}
      </Switch>
      {user
        ? <Redirect from='/login' to={`/unit/${user.employee.unit._id}`}/>
        : <Redirect from='*' to='/login'/>}
    </div>
  );
}

export default App;
