import React from 'react';
import UpperResolution from "./UpperResolution/UpperResolution";
import BottomResolution from "./BottomResolution/BottomResolution";
import {monthes} from "../../../data";
import Row from "./Row/Row";

export default function Table({unit, post, date, isFullDuty}) {
  const currentMonth = monthes[date.getMonth() - 1];
  const days = [...Array(currentMonth.days)].map((x, i) => {
    const d = new Date(date.getFullYear(), date.getMonth() - 1, i + 1);
    const isHoliday = d.getDay() === 0 || d.getDay() === 6;
    const cellStyle = {
      backgroundColor: isHoliday ? 'grey' : 'white'
    };
    return <th key={i + 1} style={cellStyle}>{i + 1}</th>;
  });

  const rows = unit.employees
    .sort((a, b) => b.rank.index - a.rank.index)
    .map(employee => <Row key={employee._id}
                          employee={employee}
                          days={currentMonth.days}
                          date={date}
                          isFullDuty={isFullDuty}/>);

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
          <th rowSpan="2" style={{width: 3 + '%'}}>#</th>
          <th rowSpan="2" style={{width: 7 + '%'}}>Військове звання</th>
          <th rowSpan="2" style={{width: 10 + '%'}}>ПІБ</th>
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