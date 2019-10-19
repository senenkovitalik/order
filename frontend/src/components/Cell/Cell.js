import React from 'react';
import PropTypes from 'prop-types';
import './Cell.css';
import {dutyMapping} from "../data";

function cell({ day, duty, setCurrentDay, togglePopover }) {
  const content = duty ? dutyMapping[duty.type].content : null;
  const classList = ['cell'];

  if (duties) {
    classList.push(dutyMapping[duties.duty].className)
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

cell.propTypes = {
  day: PropTypes.number.isRequired,
  duty: PropTypes.shape({
    day: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
  }),
  setCurrentDay: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired
};