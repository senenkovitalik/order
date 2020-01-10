import React, { useEffect, useState } from 'react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';
import Controls from './Controls/Controls';
import Popover from './Popover/Popover';
import Spinner from '../../components/Spiner/Spinner';
import Table from './Table/Table';
import { DutyContext } from './DutyContext';
import { getSearchParams } from '../../utils';
import './OrderChart.css';

const DUTIES = loader('./queries/DUTIES.graphql');

export default function OrderChart(props) {
  const [duties, setDuties] = useState([]);
  const [isFullDuty, setDutyType] = useState(true);
  const [isPopoverShown, setPopoverVisibility] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

  const { year, month } = getSearchParams(props);

  const { loading, error, data } = useQuery(DUTIES, {
    variables: {
      unitId: props.match.params.unitId,
      postId: props.match.params.postId,
      year,
      month
    }
  });

  const checkDuty = dutyType => {
    const newDuty = {
      date: currentDate,
      type: dutyType,
      employee: {
        _id: currentEmployeeId
      }
    };

    const predicateFn = ({ date, employee: { _id } }) =>
      date.getTime() === newDuty.date.getTime() && _id === newDuty.employee._id;
    const isDutyAlreadyExist = duties.find(predicateFn);

    if (isDutyAlreadyExist) {
      setDuties(duties.filter(duty => !predicateFn(duty)));
    } else {
      setDuties(duties.concat([newDuty]));
    }
  };

  const clearDuties = () => {
    setDuties([]);
  };

  const saveDuties = () => {
    console.log('Try to save duties', duties);
  };

  useEffect(() => {
    if (!data) return;
    setDuties(data.post.duties);
  }, [data]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      <div style={{ padding: '2rem' }}>
        {/*{isAlertShown && <Alert success={isAlertSuccess} dismiss={dismissAlert}>{alertContent}</Alert>}*/}

        <div className="order-chart landscape" style={{ border: '1px solid black' }}>

          <Controls isFullDuty={isFullDuty}
                    setDutyType={() => setDutyType(!isFullDuty)}
                    clearDuties={() => clearDuties()}
                    saveDuties={() => saveDuties()}
          />

          <Table unit={data.unit} post={data.post} duties={duties} date={new Date(year, month)}/>

          {!isFullDuty && <Popover/>}
        </div>
      </div>
    </DutyContext.Provider>
  );
}