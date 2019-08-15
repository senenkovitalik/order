import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const fakeLinkStyle = {
  textDecoration: 'underline',
  cursor: 'pointer'
};

function FakeLink({title, logout}) {
  return (
    <span style={fakeLinkStyle} onClick={logout}>{title}</span>
  );
}

export default function navbar({isLogged, logout}) {
  return (
    <ul className={'nav hide-on-print'}>
      {
        isLogged && <React.Fragment>
          <li className='nav__item'><Link to='/'>Підрозіл</Link></li>
          <li className='nav__item'><Link to='/order'>Витяг чергової зміни</Link></li>
          <li className='nav__item'><FakeLink title='Logout' logout={logout}/></li>
        </React.Fragment>
      }
      {
        !isLogged && <li className='nav__item'>
          <Link to='/login'>Login</Link>
        </li>
      }
    </ul>
  );
}