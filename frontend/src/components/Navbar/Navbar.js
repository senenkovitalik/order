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

export default function navbar({user, logout}) {
  return (
    <ul className={'nav hide-on-print'}>
      {
        user && <React.Fragment>
          <li className='nav__item'><Link to='/'>Home</Link></li>
          <li className='nav__item'><Link to={`/unit/${user.unit}`}>Підрозіл</Link></li>
          <li className='nav__item'><Link to='/order'>Витяг чергової зміни</Link></li>
          <li className='nav__item'><FakeLink title='Logout' logout={logout}/></li>
        </React.Fragment>
      }
      {
        !user && <li className='nav__item'>
          <Link to='/login'>Login</Link>
        </li>
      }
    </ul>
  );
}