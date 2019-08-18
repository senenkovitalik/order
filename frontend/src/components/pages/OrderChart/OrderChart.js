import React from 'react';
import Controls from '../../Controls/Controls';
import './OrderChart.css';
import Row from '../../Row/Row';
import Popover from '../../Popover/Popover';
import UpperResolution from '../OrderChart/UpperResolution/UpperResolution';
import BottomResolution from '../OrderChart/BottomResolution/BottomResolution';
import axios from 'axios';

class OrderChart extends React.Component {
  state = {
    unit: null,
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
    const head = this.state.unit ? this.state.unit.head : null;
    const employees = this.state.unit ? this.state.unit.employees : [];
    const days = [...Array(30)].map((x, i) => <th key={i + 1}>{i + 1}</th>);
    const rows = employees.sort((a, b) => b.rank.index - a.rank.index)
      .map((employee, i) =>
        <Row key={employee._id}
             checkDay={this.checkDay}
             setCurrentUserId={this.setCurrentUserId}
             setCurrentDay={this.setCurrentDay}
             employee={employee}
             togglePopover={this.togglePopover}
             index={i + 1}/>
      );

    const parentUnit = this.state.unit ? this.state.unit.parentUnit : null;
    return (
      <div className="order-chart landscape">

        <Controls isFullDuty={this.state.isFullDuty}
                  handleChange={this.handleRadioChange}
                  clearDuties={this.clearDuties}/>

        {parentUnit && <UpperResolution head={parentUnit.head} />}

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

        <BottomResolution head={head} />

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

  componentDidMount() {
    const unitId = this.props.match.params.id;
    if (unitId) {
      const requestBody = {
        query: `query Unit($id: String!) {
          unit(id: $id) {
            _id
            name
            head {
              _id
              name
              surname
              patronymic
              rank {
                name
              }
              position {
                name
              }
            }
            employees {
              _id
              rank {
                index
                shortName
              }
              name
              surname
              patronymic
            }
            parentUnit {
              _id
              head {
                name
                surname
                rank {
                  name
                }
                position {
                  name
                }
              }
            }
          }
        }`,
        variables: { id: unitId }
      };
      axios.get('/graphql', {
        baseURL: 'http://localhost:3001/',
        params: requestBody
      })
        .then(res => {
          const { unit } = res.data.data;
          this.setState({ unit });
        })
        .catch(err => console.error(err));
    }
  }
}

export default OrderChart;
