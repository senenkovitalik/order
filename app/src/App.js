import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import OrderChart from './components/pages/OrderChart/OrderChart.js';
import Order from './components/pages/Order/Order';
import Unit from './components/pages/Unit/Unit';
import Login from './components/pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import { login } from './fake-backend';
import './App.css';

class App extends React.Component {
  state = {
    isLogged: window.localStorage.getItem('userToken'),
    users: [
      {
        id: 'a43c',
        name: 'Сененко В.',
        rank: 12,
        duties: [
          { day: 5, duty: '011' },
          // { day: 8, duty: '101' },
          // { day: 11, duty: '111' },
        ]
      },
      {
        id: 'g234',
        name: 'Возенков С.',
        rank: 11,
        duties: []
      },
      {
        id: 'p04r',
        name: 'Ковтун В.',
        rank: 10,
        duties: [
          // { day: 1, duty: '111' },
          { day: 4, duty: '111' },
          { day: 7, duty: '111' },
        ]
      },
      {
        id: 'fgh6',
        name: 'Грушенков А.',
        rank: 9,
        duties: []
      }
    ],
    unitName: 'Відділ автоматизованої системи передачі даних'
  };

  handleLogin = (username, password) => {
    if (login(username, password)) {
      window.localStorage.setItem('userToken', '9fj48ho3ufhf233f8fh32f');
      this.setState({
        isLogged: true
      });
      this.props.history.push('/');
    }
  };

  handleLogout = () => {
    window.localStorage.removeItem('userToken');
    this.setState({
      isLogged: false
    });
    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="App">
        <Navbar isLogged={this.state.isLogged} logout={this.handleLogout}/>
        <Switch>
          {this.state.isLogged &&
            <React.Fragment>
              <Route exact path='/' render={() => <Unit unitName={this.state.unitName} users={this.state.users}/>}/>
              <Route path='/order' component={Order}/>
              <Route path='/order_chart' component={OrderChart}/>
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
