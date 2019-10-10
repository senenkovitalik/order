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
import Posts from './components/pages/Posts/Posts';

class App extends React.Component {
  state = {
    userId: null,
    employee: null,
    unitId: null,
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
      variables: { login, password }
    };

    axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody
    })
      .then(res => {
        const { userId, token, employee } = res.data.data.login;
        window.localStorage.setItem('token', token);
        this.setState({
          userId,
          employee,
          unitId: employee.unit._id,
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
      employee: null,
      unitId: null
    });
    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="App">
        <Navbar isLogged={this.state.isLogged}
                unitId={this.state.unitId}
                logout={this.handleLogout}
        />
        <Switch>
          {
            this.state.isLogged && <React.Fragment>
              <Route exact path='/unit/:unitId/posts/:postId' component={OrderChart}/>
              <Route exact path='/unit/:unitId/posts' component={Posts}/>
              <Route exact path='/unit/:id' component={Unit}/>
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

  componentDidMount() {
    if (!this.state.userId) {
      const requestBody = {
        query: `
          query UserByToken {
            userByToken {
              _id
              employee {
                _id
                unit {
                  _id
                }
              }
            }
          }
        `
      };

      axios.get('/graphql', {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          const { _id, employee } = res.data.data.userByToken;
          this.setState({
            userId: _id,
            employee,
            unitId: employee.unit._id,
          });
          // this.props.history.push(`/unit/${employee.unit._id}`);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

export default withRouter(App);
