import React from 'react';
import './Alert.css';

export default function alert({success, close, children}) {
  const styleClass = success ? 'alert-success' : 'alert-error';
  return (
    <div className={`alert ${styleClass}`}>
      {children}
      <span className='close' onClick={close}>{}</span>
    </div>
  );
};
