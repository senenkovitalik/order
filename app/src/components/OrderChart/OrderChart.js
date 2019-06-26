import React from 'react';
import Resolution from '../Resolution/Resolution.js';
import Sign from '../Sign/Sign.js';
import './OrderChart.css';
import Row from '../Row/Row';

class OrderChart extends React.Component {
  state = {
    users: [
      {
        id: '0',
        name: 'Сененко В.',
        rank: 'м-р',
        days: [/*4, 8, 12, 16, 20, 24, 28*/]
      },
      {
        id: '1',
        name: 'Возенков С.',
        rank: 'к-н',
        days: [2, 6, 10, 14, 18, 22, 26, 30]
      },
      {
        id: '2',
        name: 'Ковтун В.',
        rank: 'ст. л-т',
        days: [3, 7, 11, 15, 19, 23, 27]
      },
      {
        id: '3',
        name: 'Грушенков А.',
        rank: 'л-т',
        days: [1, 5, 9, 13, 17, 21, 25, 29]
      }
    ]
  };

  checkDay = (userId, day) => {
    const user = this.state.users.find(u => u.id === userId);
    const isUsed = !!user.days.find(d => d === day);

    if (isUsed) {
      // remove day
      user.days = user.days.filter(d => d !== day);
    } else {
      // add day
      user.days.push(day);
    }

    this.setState(prevState => {
      return {
        users: prevState.users.filter(u => u.id !== userId).concat(user)
      }
    })
  };

  render() {
    const days = [...Array(30)].map((x, i) => <th key={i + 1}>{i + 1}</th>);
    const rows = this.state.users.map((user, i) => <Row key={user.id} user={user} index={i+1} checkDay={this.checkDay} />);

    return (
      <div className="order-chart landscape">
        <Resolution/>

        <br/><br/><br/><br/>

        <div className="row row_centered">
          <p>ГРАФІК ЧЕРГУВАННЯ</p>
          <p>старших помічників начальника пункту управління системою зв'язку</p>
          <p>на червень 2019 року</p>
        </div>

        <br/>

        <table className="table">
          <thead>
          <tr>
            <th rowSpan="2" style={{ width: 3 + '%' }}>#</th>
            <th rowSpan="2" style={{ width: 7 + '%' }}>Військове звання</th>
            <th rowSpan="2" style={{ width: 10 + '%' }}>ПІБ</th>
            <th colSpan="30">Дата</th>
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

        <Sign/>
      </div>
    );
  };
}

export default OrderChart;
