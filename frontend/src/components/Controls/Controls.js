import React from 'react';
import PropTypes from 'prop-types';
import './Controls.css';

function controls({ isFullDuty, handleChange }) {
  return (
    <div className='controls'>
      <ul>
        <li>
          <label>
            <input type='radio'
                   name='isFullDuty'
                   checked={!isFullDuty}
                   onChange={handleChange}/>
            часткова
          </label>
        </li>
        <li>
          <label>
            <input type='radio'
                   name='isFullDuty'
                   checked={isFullDuty}
                   onChange={handleChange}/>
            повна
          </label>
        </li>
        <li>
          <button type='button'>Очистити</button>
        </li>
        <li>
          <button type='button'>Зберегти</button>
        </li>
      </ul>
    </div>
  );
}

controls.propTypes = {
  isFullDuty: PropTypes.bool,
  handleChange: PropTypes.func,
  clearDuties: PropTypes.func
};

export default controls;