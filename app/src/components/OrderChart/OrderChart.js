import React from 'react';
import Controls from '../Controls/Controls';
import Resolution from '../Resolution/Resolution.js';
import Sign from '../Sign/Sign.js';
import './OrderChart.css';
import Row from '../Row/Row';
import Popover from '../Popover/Popover';
import ranks from '../../rank-mapping';

class OrderChart extends React.Component {
  state = {
    users: [
      {
        id: 'a43c',
        name: 'Сененко В.',
        rank: 12,
        duties: [
          { day: 5, duty: '011' },
          { day: 8, duty: '101' },
          { day: 11, duty: '111' },
        ]
      },
      {
        id: 'g234',
        name: 'Возенков С.',
        rank: 11,
        duties: []
      },
      {
        id: 'p04r',
        name: 'Ковтун В.',
        rank: 10,
        duties: [
          { day: 1, duty: '111' },
          { day: 4, duty: '111' },
          { day: 7, duty: '111' },
        ]
      },
      {
        id: 'fgh6',
        name: 'Грушенков А.',
        rank: 9,
        duties: []
      }
    ],
    currentUserId: null,
    currentDay: null,
    isFullDuty: true,
    isPopoverShown: false,
    popoverPosition: { x: 0, y: 0 }
  };

  /*
  Set/remove duties per day
   */
  checkDay = duty => {
    const { currentDay: day, currentUserId: userId } = this.state;

    if (!(day || userId)) {
      return;
    }

    const user = this.state.users.find(u => u.id === userId);
    const usedDuty = user.duties.find(d => d.day === day);

    if (!!usedDuty) {
      user.duties = user.duties.filter(duty => duty.day !== day);
    } else {
      user.duties.push({ day, duty });
    }

    this.setState(prevState => (
      { users: prevState.users.filter(u => u.id !== userId).concat(user) }
    ));
  };

  togglePopover = (isShown, e) => {
    const { top, left, width } = e.target.getBoundingClientRect();
    this.setState({
      isPopoverShown: isShown,
      popoverPosition: { x: left + width + window.scrollX, y: top + window.scrollY }
    });
  };

  handleRadioChange = () => {
    this.setState(prevState => ({ isFullDuty: !prevState.isFullDuty }));
  };

  // event handler on tr element fire this method
  setCurrentUserId = userId => {
    this.setState({
      currentUserId: userId
    });
  };

  // event handler on tr element fire this method
  setCurrentDay = day => {
    this.setState({
      currentDay: day
    });
  };

  // Clear duties for all users
  clearDuties = () => {
    this.setState(prevState => {
      const usersUpdated = [...prevState.users];
      usersUpdated.forEach(user => {
        user.duties = []
      });
      return { users: usersUpdated };
    });
  };

  render() {
    const days = [...Array(30)].map((x, i) => <th key={i + 1}>{i + 1}</th>);
    const rows = this.state.users
      .sort((a, b) => ranks[b.rank].index - ranks[a.rank].index)
      .map((user, i) => <Row key={user.id}
                             checkDay={this.checkDay}
                             setCurrentUserId={this.setCurrentUserId}
                             setCurrentDay={this.setCurrentDay}
                             user={user}
                             togglePopover={this.togglePopover}
                             index={i + 1}/>
      );

    return (
      <div className="order-chart landscape">

        <Controls isFullDuty={this.state.isFullDuty}
                  handleChange={this.handleRadioChange}
                  clearDuties={this.clearDuties}/>

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

        {
          !this.state.isFullDuty &&
          <Popover isShown={this.state.isPopoverShown}
                   togglePopover={this.togglePopover}
                   position={this.state.popoverPosition}
                   checkDay={this.checkDay}/>
        }
      </div>
    );
  };
}

export default OrderChart;
