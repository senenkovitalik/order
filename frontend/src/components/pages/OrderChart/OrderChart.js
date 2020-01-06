import React, {useState} from 'react';
import {loader} from 'graphql.macro';
import Controls from '../../Controls/Controls';
import './OrderChart.css';
import Row from '../../Row/Row';
import Popover from '../../Popover/Popover';
import UpperResolution from '../OrderChart/UpperResolution/UpperResolution';
import BottomResolution from '../OrderChart/BottomResolution/BottomResolution';
import {monthes} from '../../data';
import Alert from '../../Alert/Alert';
import Spinner from '../../Spiner/Spinner';
import {getSearchParams} from '../../../utils';
import {useQuery} from "@apollo/react-hooks";

function OrderChart(props) {
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [isFullDuty, setDutyType] = useState(true);
  const [isAlertShown, setAlertVisibility] = useState(false);
  const [isAlertSuccess, setSuccessAlertState] = useState(true);
  const [alertContent, setAlertContent] = useState('Something happens');
  const [isPopoverShown, setPopoverVisibility] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({x: 0, y: 0});

  const {year, month} = getSearchParams(props);

  const DUTIES = loader('./queries/DUTIES.graphql');
  const {loading, data} = useQuery(DUTIES, {
    variables: {
      unitId: props.match.params.unitId,
      postId: props.match.params.postId,
      year,
      month
    },
    onError: error => {
      console.error(error);
      // setAlertVisibility(true);
      // setSuccessAlertState(false);
    }
  });

  // Set/remove duties per day
  const checkDay = dutyType => {
    // if (!(currentDay || currentEmployeeId)) {
    //   return;
    // }
    //
    // const employee = data.unit.employees.find(e => e._id === employeeId);
    // const usedDuty = employee.duties.find(d => d.day === day);
    //
    // if (!!usedDuty) {
    //   employee.duties = employee.duties.filter(duty => duty.day !== day);
    // } else {
    //   employee.duties.push({currentDay, type: dutyType});
    // }
    //
    // this.setState(prevState => ({
    //   unit: {
    //     ...prevState.unit,
    //     employees: prevState.unit.employees.filter(e => e._id !== employeeId).concat(employee)
    //   }
    // }));
  };

  const togglePopover = (isShown, e) => {
    const {top, left, width} = e.target.getBoundingClientRect();
    this.setState({
      isPopoverShown: isShown,
      popoverPosition: {x: left + width + window.scrollX, y: top + window.scrollY}
    });
  };

  const handleRadioChange = () => {
    this.setState(prevState => ({isFullDuty: !prevState.isFullDuty}));
  };

  // event handler on tr element fire this method
  const setCurrentEmployee = userId => {
    this.setState({
      currentEmployeeId: userId
    });
  };

  // event handler on tr element fire this method
  const setCurrentDayHandler = day => {
    this.setState({
      currentDay: day
    });
  };

  // Clear duties for all users
  const clearDuties = () => {
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

  const saveDuties = () => {
    const dutiesByEmployee = this.state.unit.employees.map(e =>
      e.duties.map(({day, type}) => ({
          day,
          type,
          employee: e._id
        })
      )
    );
    const duties = dutiesByEmployee.reduce((total, current) => total.concat(current), []);
    const {year, month} = this.getSearchParams();
    const monthDutiesInput = {
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
        monthDutiesInput
      }
    };

    // axios.post('/graphql',
    //   {},
    //   {
    //     baseURL: 'http://localhost:3001/',
    //     params: requestBody,
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     }
    //   })
    //   .then(res => {
    //     this.setState({
    //       isAlertShown: true,
    //       isAlertSuccess: true,
    //       alertContent: 'Зміни збережено успішно'
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.setState({
    //       isAlertShown: true,
    //       isAlertSuccess: false,
    //       alertContent: 'Щось трапилося. Зверніться до адміністратора за допомогою.'
    //     });
    //   });
  };

  const dismissAlert = () => {
    this.setState({
      isAlertShown: false
    });
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
      <Spinner/>
    </div>;
  }

  if (data) {
    const currentMonth = monthes[month - 1];
    const days = [...Array(currentMonth.days)].map((x, i) => {
      const d = new Date(year, month - 1, i + 1);
      const isHoliday = d.getDay() === 0 || d.getDay() === 6;
      return <th key={i + 1} style={{backgroundColor: isHoliday ? 'grey' : 'white'}}>{i + 1}</th>;
    });
    const rows = data.unit.employees
      .sort((a, b) => b.rank.index - a.rank.index)
      .map((employee, i) =>
        <Row key={employee._id}
             year={year}
             month={month}
             days={currentMonth.days}
             checkDay={checkDay}
             setCurrentEmployeeId={setCurrentEmployeeId}
             setCurrentDay={setCurrentDay}
             employee={employee}
             togglePopover={togglePopover}
             index={i + 1}/>
      );

    return (
      <div style={{padding: '2rem'}}>
        {isAlertShown && <Alert success={isAlertSuccess} dismiss={dismissAlert}>{alertContent}</Alert>}

        {data && <React.Fragment>
          <div style={{padding: '0.5rem'}}>{''}</div>

          <div className="order-chart landscape" style={{border: '1px solid black'}}>

            <Controls isFullDuty={isFullDuty}
                      handleChange={handleRadioChange}
                      clearDuties={clearDuties}
                      saveDuties={saveDuties}/>

            <UpperResolution head={data.unit.head}/>

            <br/><br/><br/><br/>

            <div className="row row_centered">
              <p>ГРАФІК ЧЕРГУВАННЯ</p>
              <p>особового складу {data.unit.name}</p>
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

            <BottomResolution head={data.unit.head}/>

            {!isFullDuty && <Popover isShown={isPopoverShown}
                                     togglePopover={togglePopover}
                                     position={popoverPosition}
                                     checkDay={checkDay}/>
            }
          </div>
        </React.Fragment>}
      </div>
    );
  }
}

export default OrderChart;
