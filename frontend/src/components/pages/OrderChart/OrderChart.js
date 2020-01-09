import React, {useState} from 'react';
import {loader} from 'graphql.macro';
import {useQuery} from '@apollo/react-hooks';
import Controls from '../../Controls/Controls';
import Popover from './Popover/Popover';
import Spinner from '../../Spiner/Spinner';
import Table from "./Table/Table";
import {DutyContext} from './DutyContext';
import {getSearchParams} from '../../../utils';
import './OrderChart.css';

const DUTIES = loader('./queries/DUTIES.graphql');

export default function OrderChart(props) {
  const [isFullDuty, setDutyType] = useState(true);
  const [isPopoverShown, setPopoverVisibility] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({x: 0, y: 0});
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

  const {year, month} = getSearchParams(props);

  const checkDuty = (dutyType) => {
    // todo
    console.log(currentEmployeeId, currentDate.toISOString(), dutyType);
  };

  const {loading, error, data} = useQuery(DUTIES, {
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

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
      <Spinner/>
    </div>;
  }

  if (error) {
    return 'Some error';
  }

  return (
    <DutyContext.Provider
      value={{
        isPopoverShown,
        popoverPosition,
        setPopoverPosition,
        setPopoverVisibility,
        checkDuty,
        setCurrentEmployeeId,
        setCurrentDate
      }}>
      <div style={{padding: '2rem'}}>
        {/*{isAlertShown && <Alert success={isAlertSuccess} dismiss={dismissAlert}>{alertContent}</Alert>}*/}

        <div className="order-chart landscape" style={{border: '1px solid black'}}>

          <Controls isFullDuty={isFullDuty} handleChange={() => setDutyType(!isFullDuty)}/>

          <Table unit={data.unit} post={data.post} date={new Date(year, month)} isFullDuty={isFullDuty}/>

          {!isFullDuty && <Popover/>}
        </div>
      </div>
    </DutyContext.Provider>
  );
}