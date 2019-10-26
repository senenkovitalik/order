import React from 'react';
import Controls from '../../Controls/Controls';
import './OrderChart.css';
import Row from '../../Row/Row';
import Popover from '../../Popover/Popover';
import UpperResolution from '../OrderChart/UpperResolution/UpperResolution';
import BottomResolution from '../OrderChart/BottomResolution/BottomResolution';
import { monthes } from '../../data';
import axios from 'axios';
import Alert from '../../Alert/Alert';
import Spinner from '../../Spiner/Spinner';

const CancelToken = axios.CancelToken;
let cancelUnit, cancelMonthDuties;

class OrderChart extends React.Component {
  state = {
    loading: false,
    unit: null,
    duties: [],
    currentEmployeeId: null,
    currentDay: null,
    isFullDuty: true,
    isPopoverShown: false,
    isAlertShown: false,
    isAlertSuccess: true,
    alertContent: '',
    popoverPosition: { x: 0, y: 0 }
  };

  /*
  Set/remove duties per day
   */
  checkDay = dutyType => {
    const { currentDay: day, currentEmployeeId: employeeId } = this.state;

    if (!(day || employeeId)) {
      return;
    }

    const employee = this.state.unit.employees.find(e => e._id === employeeId);
    const usedDuty = employee.duties.find(d => d.day === day);

    if (!!usedDuty) {
      employee.duties = employee.duties.filter(duty => duty.day !== day);
    } else {
      employee.duties.push({ day, type: dutyType });
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
    const dutiesByEmployee = this.state.unit.employees.map(e =>
      e.duties.map(({ day, type }) => ({
          day,
          type,
          employee: e._id
        })
      )
    );
    const duties = dutiesByEmployee.reduce((total, current) => total.concat(current), []);
    const { year, month } = this.getSearchParams();
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
        this.setState({
          isAlertShown: true,
          isAlertSuccess: true,
          alertContent: 'Зміни збережено успішно'
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAlertShown: true,
          isAlertSuccess: false,
          alertContent: 'Щось трапилося. Зверніться до адміністратора за допомогою.'
        });
      });
  };

  render() {
    const { year, month } = this.getSearchParams();
    if (!year && !month) {
      return null;
    }
    const currentMonth = monthes[month - 1];
    const head = this.state.unit ? this.state.unit.head : null;
    const employees = this.state.unit ? this.state.unit.employees : [];
    const days = [...Array(currentMonth.days)].map((x, i) => {
      const d = new Date(year, month - 1, i + 1);
      const isHoliday = d.getDay() === 0 || d.getDay() === 6;
      return <th key={i + 1} style={{backgroundColor: isHoliday ? 'grey' : 'white'}}>{i + 1}</th>;
    });
    const rows = employees.sort((a, b) => b.rank.index - a.rank.index)
      .map((employee, i) =>
        <Row key={employee._id}
             year={year}
             month={month}
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
      <div style={{ padding: '2rem' }}>
        {this.state.isAlertShown && <Alert success={this.state.isAlertSuccess}>{this.state.alertContent}</Alert>}

        {this.state.loading
          ? <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spinner/>
          </div>
          : <React.Fragment>
            <div style={{ padding: '0.5rem' }}>{''}</div>

            <div className="order-chart landscape" style={{ border: '1px solid black' }}>

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
          </React.Fragment>}
      </div>
    );
  };

  // Fetch unit & duties data
  componentDidMount() {
    const { year, month } = this.getSearchParams()
      ? this.getSearchParams()
      : null;
    if (!year && !month) {
      return null;
    }

    this.setState({
      loading: true
    });

    axios.all([this.getUnitData(), this.getMonthDuties()])
      .then(axios.spread((unitData, monthDutiesData) => {
        const { unit } = unitData.data.data;
        const { monthDuties } = monthDutiesData.data.data;
        const unitWithDuties = Object.assign(
          {},
          unit,
          {
            employees: unit.employees.map(employee => ({
              ...employee,
              duties: monthDuties.length
                ? monthDuties[0].duties.filter(duty => duty.employee._id === employee._id)
                : []
            }))
          }
        );
        this.setState({
          unit: unitWithDuties,
          loading: false
        });
      }))
      .catch(err => console.error(err));
  }

  getUnitData() {
    const requestBody = {
      query: `
        query Unit($id: ID!) {
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
      variables: {
        id: this.props.match.params.unitId
      }
    };
    return axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      cancelToken: new CancelToken(c => cancelUnit = c)
    });
  }

  getMonthDuties() {
    const { year, month } = this.getSearchParams()
      ? this.getSearchParams()
      : null;
    const requestBody = {
      query: `
        query MonthDuties($year: Int!, $month: Int!, $post: ID!) {
          monthDuties(year: $year, month: $month, post: $post) {
            _id
            unit {
              _id
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
    return axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      cancelToken: new CancelToken(c => cancelMonthDuties = c)
    });
  }

  // todo: refactor
  getSearchParams() {
    const searchProp = this.props.location.search;
    if (!searchProp.length) {
      return null;
    }
    const searchStr = searchProp.slice(1);
    const parts = searchStr.split('&');
    const searchObj = {};
    parts.forEach(p => {
      const [key, value] = p.split('=');
      searchObj[key] = parseInt(value, 10);
    });
    return searchObj;
  }

  // cancel data fetch
  componentWillUnmount() {
    cancelUnit();
    cancelMonthDuties();
  }
}

export default OrderChart;
