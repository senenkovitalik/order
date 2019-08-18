import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import OrderChart from './components/pages/OrderChart/OrderChart.js';
import Order from './components/pages/Order/Order';
import Unit from './components/pages/Unit/Unit';
import Login from './components/pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';

import './App.css';

class App extends React.Component {
  state = {
    userId: null,
    isLogged: window.localStorage.getItem('token')
  };

  handleLogin = (login, password) => {
    const requestBody = {
      query: `
        query Login($login: String!, $password: String!) {
          login(login: $login, password: $password) {
            userId
            token
            employee {
              _id
              unit {
                _id
              }
            }
          }
        }
      `,
      variables: {login, password}
    };

    axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody
    })
    .then(res => {
      const {userId, token, employee: { unit: { _id: unitId }}} = res.data.data.login;
      window.localStorage.setItem('token', token);
        this.setState({
          userId,
          isLogged: true
        });
        this.props.history.push(`/unit/${unitId}`);
    })
    .catch(err => {
      console.log(err);
    });
  };

  handleLogout = () => {
    window.localStorage.removeItem('token');
    this.setState({
      isLogged: false,
      userId: null
    });
    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="App">
        <Navbar isLogged={this.state.isLogged} logout={this.handleLogout}/>
        <Switch>
          {
            this.state.isLogged && <React.Fragment>
              <Route exact path='/unit/:id' component={Unit}/>
              <Route path='/order' component={Order}/>
              <Route path='/unit/:id/order_chart' component={OrderChart}/>
            </React.Fragment>
          }
          <Route path='/login' render={() => <Login login={this.handleLogin}/>}/>
          {!this.state.isLogged && <Redirect to='/login'/>}
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
