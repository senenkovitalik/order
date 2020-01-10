import React from 'react';
import './Controls.css';

function controls({ isFullDuty, setDutyType, clearDuties, saveDuties }) {
  return (
    <div className='controls'>
      <ul>
        <li>
          <label>
            <input type='radio' name='isFullDuty' checked={!isFullDuty} onChange={setDutyType}/>{'часткова'}
          </label>
        </li>
        <li>
          <label>
            <input type='radio' name='isFullDuty' checked={isFullDuty} onChange={setDutyType}/>{'повна'}
          </label>
        </li>
        <li>
          <button type='button' onClick={clearDuties}>Очистити</button>
        </li>
        <li>
          <button type='button' onClick={saveDuties}>Зберегти</button>
        </li>
      </ul>
    </div>
  );
}

export default controls;