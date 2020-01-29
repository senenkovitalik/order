import React, { useContext } from 'react';
import { DutyContext } from '../../DutyContext';
import Cell from '../Cell/Cell';
import { monthes } from '../../../../data';

export default function Row({ date, employee, duties }) {
  const { setCurrentEmployeeId } = useContext(DutyContext);

  const currentMonth = monthes[date.getMonth()];

  const cells = [...Array(currentMonth.days)].map((x, i) => {
    const dutyDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
    const duty = duties.find(({date}) => date.getTime() === dutyDate.getTime());
    return <Cell key={i} date={dutyDate} duty={duty}/>
  });

  const { name, surname, patronymic } = employee;
  const empName = `${surname} ${name.charAt(0).toUpperCase()}.${patronymic.charAt(0).toUpperCase()}.`;

  return (
    <tr onMouseEnter={() => setCurrentEmployeeId(employee._id)}>
      <td>1</td>
      <td className="align-left" style={{whiteSpace: 'nowrap'}}>{employee.rank.shortName}</td>
      <td className="align-left" style={{whiteSpace: 'nowrap'}}>{empName}</td>
      {cells}
    </tr>
  );
}

