import React, { useEffect, useRef, useState } from 'react';
import './Login.css';

function LoginForm({ getLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const buttonEl = useRef(null);

  useEffect(() => {
    if (buttonEl && buttonEl.current) {
      buttonEl.current.disabled = !(login && password);
    }
  });

  return (
    <form className='login-form' style={{ border: '1px solid black' }}>
      <h2>Login</h2>
      <label>Username<br/>
        <input type='text' onChange={e => setLogin(e.target.value)}/>
      </label>
      <br/>
      <label>Password<br/>
        <input type='password' onChange={e => setPassword(e.target.value)}/>
      </label>
      <br/>
      <input type='button' value='Login' ref={buttonEl} onClick={() => getLogin(login, password)}/>
    </form>
  );
}

export default LoginForm;