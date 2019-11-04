import React from 'react';
import './Alert.css';
import PropTypes from 'prop-types';

export default function alert({success, children, dismiss}) {
  const styleClass = success ? 'alert-success' : 'alert-error';
  return (
    <div className={`alert ${styleClass}`}>
      {children}
      <span className='close' onClick={dismiss}>{}</span>
    </div>
  );
}

alert.propTypes = {
  success: PropTypes.bool
};
