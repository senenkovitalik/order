import React from 'react';
import ranks from '../../rank-mapping';
import { Link } from 'react-router-dom';

export default function unit({users, unitName}) {
  return (
    <div className='unit' style={{padding: '2rem'}}>
      <h2>Особовий склад підрозділу: {unitName}</h2>
      <ul>
        {
          users
            .sort((a, b) => b.rank - a.rank)
            .map(user => <li key={user.id}>{ranks[user.rank].short} {user.name}</li>)
        }
      </ul>
      <Link to={{
        pathname: '/order_chart',
        state: {users}
      }}>Графік чергування</Link>
    </div>
  );
}
