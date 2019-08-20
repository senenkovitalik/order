import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import OrderChart from './components/pages/OrderChart/OrderChart.js';
import Order from './components/pages/Order/Order';
import Unit from './components/pages/Unit/Unit';
import Login from './components/pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Employee from './components/pages/Employee/Employee';
import axios from 'axios';

import './App.css';

class App extends React.Component {
  state = {
    userId: null,
    employee: null,
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
      const {userId, token, employee} = res.data.data.login;
      window.localStorage.setItem('token', token);
        this.setState({
          userId,
          employee,
          isLogged: true
        });
        this.props.history.push(`/unit/${employee.unit._id}`);
    })
    .catch(err => {
      console.log(err);
    });
  };

  handleLogout = () => {
    window.localStorage.removeItem('token');
    this.setState({
      isLogged: false,
      userId: null,
      employee: null
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
              <Route path='/unit/:id/order_chart' component={OrderChart}/>
              <Route path='/employee/:id' component={Employee}/>
              <Route path='/order' component={Order}/>
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
