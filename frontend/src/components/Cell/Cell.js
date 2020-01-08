import React from 'react';
import './Cell.css';
import { dutyMapping } from '../data';

function cell({ day, isHoliday, duty, setCurrentDay, togglePopover }) {
  const content = duty ? dutyMapping[duty.type].content : null;
  const classList = ['cell'];

  if (isHoliday) {
    classList.push('cell_holiday')
  }

  if (duty) {
    classList.push(dutyMapping[duty.type].className)
  }

  return (
    <td onMouseEnter={e => { setCurrentDay(day); togglePopover(true, e); }}
        onMouseLeave={e => { togglePopover(false, e) }}
        data-day={day}
        className={classList.join(' ')}
    >{content}</td>
  );
}

export default cell;