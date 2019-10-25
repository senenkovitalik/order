import React from 'react';
import './Spinner.css';

function spinner() {
  return (<div className="lds-roller">
      <div>{''}</div>
      <div>{''}</div>
      <div>{''}</div>
      <div>{''}</div>
      <div>{''}</div>
      <div>{''}</div>
      <div>{''}</div>
      <div>{''}</div>
    </div>
  );
}

export default spinner;