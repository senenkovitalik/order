import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';
import { monthes } from '../../data';
import Spinner from '../../components/Spiner/Spinner';

const DUTY_EXISTENCE = loader('./DUTY_EXISTENCE.graphql');

function PostInfo(props) {
  const [dateRef, setRef] = useState(undefined);

  const {loading, error, data} = useQuery(DUTY_EXISTENCE, {
    variables: {
      postId: props.match.params.postId
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    const [year, month] = dateRef.value.split('-');
    props.history.push(`${props.location.pathname}/orderChart?year=${year}&month=${month}`);
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
      <Spinner/>
    </div>;
  }

  if (error) {
    return <div>Some error happens</div>;
  }

  return (<div style={{padding: '2rem'}}>
      <h2>Графіки чергування на {new Date().getFullYear()}</h2>
      <div>
        {!!data.dutyExistence.length
          ? <ul>
            {data.dutyExistence.map(({year, month}, i) =>
              <li key={i}>
                <Link to={`${props.location.pathname}/orderChart?year=${year}&month=${month+1}`}>
                  Графік чергування - {monthes[month].name}, {year}
                </Link>
              </li>)
            }
          </ul>
          : 'Нічого не знайдено :('}
      </div>
      <form onSubmit={handleSubmit}>
        <label>Заповнити графік чергування на{' '}
          <input type='month' ref={(element) => setRef(element)}/></label>
        <input type='submit' value={'Заповнити'}/>
      </form>
    </div>
  );
}

export default PostInfo;
