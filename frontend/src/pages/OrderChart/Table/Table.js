import React from 'react';
import UpperResolution from './UpperResolution/UpperResolution';
import BottomResolution from './BottomResolution/BottomResolution';
import Row from './Row/Row';
import { detectHoliday } from '../../../utils';
import { monthes } from '../../../data';

export default function Table({ unit, post, duties, date }) {
  const currentMonth = monthes[date.getMonth() - 1];

  const d = new Date(date.getTime());
  const days = [...Array(currentMonth.days)].map((x, i) => {
    const backgroundColor = detectHoliday(d.setDate(i + 1)) ? 'grey' : 'white';
    return <th key={i + 1} style={{backgroundColor}}>{i + 1}</th>;
  });

  const rows = unit.employees.sort((a, b) => b.rank.index - a.rank.index)
    .map(employee => {
        const employeeDuties = duties.filter(duty => duty.employee._id === employee._id);
        return <Row key={employee._id}
                    employee={employee}
                    duties={employeeDuties}
                    date={date} />;
      }
    );

  return (
    <React.Fragment>
      <UpperResolution head={unit.head}/>

      <br/><br/><br/><br/>

      <div className="row row_centered">
        <p>ГРАФІК ЧЕРГУВАННЯ</p>
        <p>{post.name} - {post.position}</p>
        <p>на {currentMonth.name} {date.getFullYear()} року</p>
      </div>

      <br/>

      <table className="table">
        <thead>
        <tr>
          <th rowSpan="2" style={{ width: 3 + '%' }}>#</th>
          <th rowSpan="2" style={{ width: 7 + '%' }}>Військове звання</th>
          <th rowSpan="2" style={{ width: 10 + '%' }}>ПІБ</th>
          <th colSpan={currentMonth.days}>Дата</th>
        </tr>
        <tr>
          {days}
        </tr>
        </thead>
        <tbody>
        {rows}
        </tbody>
      </table>

      <br/><br/>

      <BottomResolution head={unit.head}/>
    </React.Fragment>
  );
}