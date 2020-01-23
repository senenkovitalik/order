import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import Spinner from '../../components/Spiner/Spinner';
import Alert from '../../components/Alert/Alert';
import Posts from './Posts/Posts';
import Units from './Units/Units';
import Employees from './Employees/Employees';
import Positions from './Positions/Positions';

const UNIT = loader('./UNIT.graphql');

export default function Unit(props) {
  const [isAlertShown, setAlertVisibility] = useState(false);
  const [isAlertSuccess, setSuccessAlertState] = useState(true);
  const [alertContent, setAlertContent] = useState('Something happens');

  const { loading, data } = useQuery(UNIT, {
    variables: {
      id: props.match.params.unitId
    },
    onError: error => {
      setAlertVisibility(true);
      setSuccessAlertState(false);
    }
  });

  const showAlert = (success, content = 'Something happens') => {
    setAlertVisibility(true);
    setSuccessAlertState(success);
    setAlertContent(content);
  };

  const closeAlert = () => setAlertVisibility(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner/>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isAlertShown && <div style={{ paddingTop: '1rem' }}>
        <Alert success={isAlertSuccess} dismiss={closeAlert}>
          {alertContent}
        </Alert>
      </div>}

      {data && data.unit && <React.Fragment>
        <h1>{data.unit.name}</h1>

        {/* Head */}
        <div>
          {data.unit.head.position.name}<br/>
          {data.unit.head.rank.name} {data.unit.head.surname} {data.unit.head.name} {data.unit.head.patronymic}
        </div>

        <Positions unitID={data.unit._id} seniorPositionID={data.unit.head.position._id}
                   positions={data.unit.head.position.juniorPositions} showAlert={showAlert}/>

        <Employees unitID={data.unit._id} employees={data.unit.employees} headPosition={data.unit.head.position._id}
                   showAlert={showAlert}/>

        <Units unitID={data.unit._id} childUnits={data.unit.childUnits} employees={data.unit.employees}
               showAlert={showAlert}/>

        <Posts unitId={data.unit._id} posts={data.unit.posts} pathname={props.location.pathname} showAlert={showAlert}/>

      </React.Fragment>}
    </React.Fragment>
  );
}
