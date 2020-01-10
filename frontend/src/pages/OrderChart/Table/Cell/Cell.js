import React, { useContext } from 'react';
import { DutyContext } from '../../DutyContext';
import './Cell.css';
import { dutyMapping } from '../../../../data';
import { detectHoliday } from '../../../../utils';

export default function Cell({date, duty}) {
  const {setPopoverPosition, setPopoverVisibility, setCurrentDate, checkDuty} = useContext(DutyContext);

  const content = duty ? dutyMapping[duty.type].content : null;
  const useHolidayStyle = detectHoliday(date) ? 'cell_holiday' : '';
  const useDutyStyle = duty ? dutyMapping[duty.type].className : '';
  const classNames = `cell ${useHolidayStyle} ${useDutyStyle}`;

  const mouseEnterHandler = e => {
    const {top, left, width} = e.target.getBoundingClientRect();
    setPopoverPosition({
      x: left + width + window.scrollX,
      y: top + window.scrollY
    });
    setPopoverVisibility(true);
    setCurrentDate(date);
  };

  const mouseLeaveHandler = () => setPopoverVisibility(false);

  const clickHandler = () => checkDuty('111');

  return (
    <td onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        onClick={clickHandler}
        data-day={date.getDate()}
        className={classNames}
    >{content}</td>
  );
}