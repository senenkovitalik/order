import React from 'react';
import Controls from '../../Controls/Controls';
import './OrderChart.css';
import Row from '../../Row/Row';
import Popover from '../../Popover/Popover';
import UpperResolution from '../OrderChart/UpperResolution/UpperResolution';
import BottomResolution from '../OrderChart/BottomResolution/BottomResolution';
import {monthes} from '../../data';
import axios from 'axios';

class OrderChart extends React.Component {
  state = {
    unit: null,
    duties: [],
    currentEmployeeId: null,
    currentDay: null,
    isFullDuty: true,
    isPopoverShown: false,
    popoverPosition: {x: 0, y: 0}
  };

  /*
  Set/remove duties per day
   */
  checkDay = dutyType => {
    const {currentDay: day, currentEmployeeId: employeeId} = this.state;

    if (!(day || employeeId)) {
      return;
    }

    const employee = this.state.unit.employees.find(e => e._id === employeeId);
    const usedDuty = employee.duties.find(d => d.day === day);

    if (!!usedDuty) {
      employee.duties = employee.duties.filter(duty => duty.day !== day);
    } else {
      employee.duties.push({day, type: dutyType});
    }

    this.setState(prevState => ({
      unit: {
        ...prevState.unit,
        employees: prevState.unit.employees.filter(e => e._id !== employeeId).concat(employee)
      }
    }));
  };

  togglePopover = (isShown, e) => {
    const {top, left, width} = e.target.getBoundingClientRect();
    this.setState({
      isPopoverShown: isShown,
      popoverPosition: {x: left + width + window.scrollX, y: top + window.scrollY}
    });
  };

  handleRadioChange = () => {
    this.setState(prevState => ({isFullDuty: !prevState.isFullDuty}));
  };

  // event handler on tr element fire this method
  setCurrentEmployeeId = userId => {
    this.setState({
      currentEmployeeId: userId
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
      const updatedEmployees = [...prevState.unit.employees];
      updatedEmployees.forEach(employee => employee.duties = []);
      return {
        unit: {
          ...prevState.unit,
          employees: updatedEmployees
        }
      };
    });
  };

  saveDuties = () => {
    const duties = this.state.unit.employees.map(e =>
      e.duties.map(({day, duty}) => ({
          day,
          type: duty,
          employee: e._id
        })
      )
    );
    const [year, month] = this.props.location.search.match(/\d+/g).map(v => parseInt(v, 10));
    const payload = {
      year,
      month,
      unit: this.props.match.params.unitId,
      post: this.props.match.params.postId,
      duties
    };

    const requestBody = {
      query: `
          mutation SaveMonthDuties($monthDutiesInput: MonthDutiesInput!) {
            saveMonthDuties(monthDutiesInput: $monthDutiesInput) {
              _id
            }
          }
        `,
      variables: {
        monthDutiesInput: payload
      }
    };

    axios.post('/graphql',
      {},
      {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        // todo
        this.setState({
          monthDuties: res.data.data.saveMonthDuties
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const [year, month] = this.props.location.search.match(/\d+/g).map(v => parseInt(v, 10));
    const currentMonth = monthes[month];
    const head = this.state.unit ? this.state.unit.head : null;
    const employees = this.state.unit ? this.state.unit.employees : [];
    const days = [...Array(currentMonth.days)].map((x, i) => <th key={i + 1}>{i + 1}</th>);
    const rows = employees.sort((a, b) => b.rank.index - a.rank.index)
      .map((employee, i) =>
        <Row key={employee._id}
             days={currentMonth.days}
             checkDay={this.checkDay}
             setCurrentEmployeeId={this.setCurrentEmployeeId}
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
                  clearDuties={this.clearDuties}
                  saveDuties={this.saveDuties}/>

        {parentUnit && <UpperResolution head={parentUnit.head}/>}

        <br/><br/><br/><br/>

        <div className="row row_centered">
          <p>ГРАФІК ЧЕРГУВАННЯ</p>
          <p>особового складу {this.state.unit ? this.state.unit.name : ''}</p>
          <p>на {currentMonth.name} {year} року</p>
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

        <BottomResolution head={head}/>

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
    const [year, month] = this.props.location.search.match(/\d+/g).map(v => parseInt(v, 10));
    const requestBody = {
      query: `
        query MonthDuties($year: Int!, $month: Int!, $post: ID!) {
          monthDuties(year: $year, month: $month, post: $post) {
            _id
            unit {
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
            duties {
              day
              type
              employee {
                _id
              }
            }
          }
        }`,
      variables: {
        year,
        month,
        post: this.props.match.params.postId
      }
    };
    axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        const {unit, duties} = res.data.data.monthDuties;
        const unitWithDuties = Object.assign({}, unit);
        unitWithDuties.employees = unit.employees.map(employee => (
          {
            ...employee,
            duties: duties.filter(({employee: {_id}}) => _id === employee._id)
          }
        ));
        this.setState({
          unit: unitWithDuties
        });
      })
      .catch(err => console.error(err));
  }
}

export default OrderChart;
