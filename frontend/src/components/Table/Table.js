import React from 'react';
import './Table.css';

export default function Table({headers, children}) {
  return (
    <table className='shared-table'>
      <thead>
      <tr>
        {headers.map((header, i) => <th key={i}>{header}</th>)}
      </tr>
      </thead>
      <tbody>
      {children}
      </tbody>
    </table>
  );
}