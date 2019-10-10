import React from 'react';
import Controls from '../../Controls/Controls';
import './OrderChart.css';
import Row from '../../Row/Row';
import Popover from '../../Popover/Popover';
import UpperResolution from '../OrderChart/UpperResolution/UpperResolution';
import BottomResolution from '../OrderChart/BottomResolution/BottomResolution';
import { monthes } from '../../data';
import axios from 'axios';

class OrderChart extends React.Component {
  state = {
    unit: null,
    currentEmployeeId: null,
    currentDay: null,
    isFullDuty: true,
    isPopoverShown: false,
    popoverPosition: { x: 0, y: 0 }
  };

  /*
  Set/remove duties per day
   */
  checkDay = duty => {
    const { currentDay: day, currentEmployeeId: employeeId } = this.state;

    if (!(day || employeeId)) {
      return;
    }

    const employee = this.state.unit.employees.find(e => e._id === employeeId);
    const usedDuty = employee.duties.find(d => d.day === day);

    if (!!usedDuty) {
      employee.duties = employee.duties.filter(duty => duty.day !== day);
    } else {
      employee.duties.push({ day, duty });
    }

    this.setState(prevState => ({
      unit: {
        ...prevState.unit,
        employees: prevState.unit.employees.filter(e => e._id !== employeeId).concat(employee)
      }
    }));
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
      e.duties.map(({ day, duty }) => (
          {
            date: new Date(new Date().getFullYear(), new Date().getMonth(), day),
            type: duty,
            employee: e._id,
            post: this.props.match.params.postId
          }
        )
      )
    );
    console.log(duties);
  };

  render() {
    const d = new Date();
    const currentMonth = monthes[d.getMonth()];
    const year = d.getFullYear();
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
    const { unitId } = this.props.match.params;
    if (unitId) {
      const requestBody = {
        query: `query Unit($id: ID!) {
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
        params: requestBody,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          const { unit } = res.data.data;
          unit.employees = unit.employees.map(e => ({ ...e, duties: [] }));
          this.setState({ unit });
        })
        .catch(err => console.error(err));
    }
  }
}

export default OrderChart;
