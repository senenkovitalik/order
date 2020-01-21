import React from 'react';
import './Backdrop.css';

export default function backdrop({ hide }) {
  return (
    <div className='backdrop' onClick={hide}>{}</div>
  );
};