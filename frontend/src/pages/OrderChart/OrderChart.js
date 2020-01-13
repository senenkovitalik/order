import React, { useEffect, useState } from 'react';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Controls from './Controls/Controls';
import Popover from './Popover/Popover';
import Spinner from '../../components/Spiner/Spinner';
import Table from './Table/Table';
import { DutyContext } from './DutyContext';
import { getSearchParams } from '../../utils';
import './OrderChart.css';
import Alert from '../../components/Alert/Alert';

const DUTIES = loader('./queries/DUTIES.graphql');
const SAVE_DUTIES = loader('./queries/SAVE_DUTIES.graphql');

// on frontend month values range (from 1-12)
// on backend month values range (from 0-11)
export default function OrderChart(props) {
  const [duties, setDuties] = useState([]);
  const [isFullDuty, setDutyType] = useState(true);
  const [isPopoverShown, setPopoverVisibility] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

  const [alertSettings, setAlertObject] = useState({
    display: false,
    success: true,
    content: 'default content'
  });

  const searchParams = getSearchParams(props);
  const year = parseInt(searchParams.year);
  const month = parseInt(searchParams.month);

  const { loading, error, data } = useQuery(DUTIES, {
    variables: {
      unitId: props.match.params.unitId,
      postId: props.match.params.postId,
      year,
      month: month - 1
    },
    onCompleted: data => {
      const formattedDuties = data.post.duties.map(({ date, ...rest }) => ({
        date: new Date(parseInt(date)),
        ...rest
      }));
      setDuties(formattedDuties);
    }
  });

  const [saveDuties, {
    error: saveDutiesError,
    loading: saveDutiesLoading,
    data: savedDutiesData
  }] = useMutation(SAVE_DUTIES, {
    onCompleted: () => setAlertObject({
      display: true,
      success: true,
      content: 'All data successfully saved'
    })
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

  const clearDuties = () => setDuties([]);

  const saveDutiesHandler = () => {
    saveDuties({
      variables: {
        postId: props.match.params.postId,
        duties: duties.map(({ date, type, employee: { _id } }) => ({ date, type, employee: _id })),
        year,
        month: month - 1
      }
    });
  };

  const dismissAlert = () => {
    setAlertObject({
      display: false,
      success: true,
      content: 'default content'
    });
  };

  // useEffect(() => {
  //   if (!data) return;
  //   const formattedDuties = data.post.duties.map(({ date, ...rest }) => ({
  //     date: new Date(parseInt(date)),
  //     ...rest
  //   }));
  //   setDuties(formattedDuties);
  // }, [data]);

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
        {alertSettings.display &&
        <Alert success={alertSettings.success} dismiss={dismissAlert}>{alertSettings.content}</Alert>}

        <div className="order-chart landscape" style={{ border: '1px solid black' }}>

          <Controls isFullDuty={isFullDuty}
                    setDutyType={() => setDutyType(!isFullDuty)}
                    clearDuties={() => clearDuties()}
                    saveDuties={() => saveDutiesHandler()}
          />

          {/* month value (from 0-11) */}
          <Table unit={data.unit} post={data.post} duties={duties} date={new Date(year, month - 1)}/>

          {!isFullDuty && <Popover/>}
        </div>
      </div>
    </DutyContext.Provider>
  );
}