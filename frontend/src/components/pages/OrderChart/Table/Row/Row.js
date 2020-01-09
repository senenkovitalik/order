import React, {useContext} from 'react';
import {DutyContext} from '../../DutyContext';
import Cell from '../Cell/Cell';

export default function Row({days, date, employee}) {
  const {setCurrentEmployeeId} = useContext(DutyContext);

  const cells = [...Array(days)].map((x, i) => {
      const day = i + 1;
      const d = new Date(date.getFullYear(), date.getMonth() - 1, day);
      const isHoliday = d.getDay() === 0 || d.getDay() === 6;
      return <Cell key={i} date={d} isHoliday={isHoliday}/>;
    });

  const {name, surname, patronymic} = employee;
  const empName = `${surname} ${name.charAt(0).toUpperCase()}.${patronymic.charAt(0).toUpperCase()}.`;
  return (
    <tr onMouseEnter={() => setCurrentEmployeeId(employee._id)}>
      <td>1</td>
      <td className="align-left">{employee.rank.shortName}</td>
      <td className="align-left">{empName}</td>
      {cells}
    </tr>
  );
}

