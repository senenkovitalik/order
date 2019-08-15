import React from 'react';
import './Login.css';

class Login extends React.Component {
  state = {
    username: null,
    password: null
  };

  handleClick = () => {
    this.props.login(this.state.username, this.state.password);
  };

  handleChange = e => {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <form className='login-form' style={{border: '1px solid black'}}>
        <h2>Login</h2>
        <label htmlFor='username'>Username</label><br/>
        <input id='username' type='text' name='username' onChange={this.handleChange} /><br/>
        <label htmlFor='password'>Password</label><br/>
        <input id='password' type='password' name='password' onChange={this.handleChange} /><br/>
        <input type='button' value='Login'
               onClick={this.handleClick}
               disabled={this.state.username && this.state.props} />
      </form>
    );
  }
}

export default Login;