import React from 'react';
import './Backdrop.css';

export default function backdrop({closeModal}) {
  return (
    <div className='backdrop' onClick={closeModal}>{}</div>
  );
};