import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

const RANKS_AND_POSITIONS = loader('./RANKS_AND_POSITIONS.graphql');

export default function CreateEmployeeForm({ headPosition, createEmployee, error, close }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [rank, setRank] = useState('');
  const [position, setPosition] = useState('');

  // query ranks & positions
  const { loading, data } = useQuery(RANKS_AND_POSITIONS, {
    variables: {
      parentPositionID: headPosition
    },
    onCompleted: ({ ranks, position }) => {
      setRank(ranks.sort((a, b) => a.index - b.index)[0]._id);
      setPosition(position.juniorPositions[0]._id);
    }
  });

  const isSubmitDisabled = () => !(name && surname && patronymic && rank && position);

  const isClearDisabled = () => !(name || surname || patronymic || rank || position);

  const clearForm = () => {
    setName('');
    setSurname('');
    setPatronymic('');
    setRank('');
    setPosition('');
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <h3>Додати працівника</h3>

      {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}

      {/* Surname */}
      <label>
        <span className='form-field'>Прізвище</span>
        <input type='text' name='surname' value={surname} onChange={e => setSurname(e.target.value)}/>
      </label>
      <br/>

      {/* Name */}
      <label>
        <span className='form-field'>І'мя</span>
        <input type='text' name='name' value={name} onChange={e => setName(e.target.value)}/>
      </label>
      <br/>

      {/* Patronymic */}
      <label>
        <span className='form-field'>По-батькові</span>
        <input type='text' name='patronymic' value={patronymic} onChange={e => setPatronymic(e.target.value)}/>
      </label>
      <br/>

      {/* Rank */}
      <label>
        <span className='form-field'>Звання</span>
        {
          loading
            ? <span>Завантаження...</span>
            : <select value={rank} onChange={e => setRank(e.target.value)}>
              {data.ranks.map(item => <option key={item._id} value={item._id}>
                {item.name}
              </option>)}
            </select>
        }
      </label>
      <br/>

      {/* Position */}
      <label>
        <span className='form-field'>Посада</span>
        {
          loading
            ? <span>Завантаження...</span>
            : <select value={position} onChange={e => setPosition(e.target.value)}>
              {data.position.juniorPositions.map(item => <option key={item._id} value={item._id}>
                {item.name}
              </option>)}
            </select>
        }
      </label>
      <br/>

      <button onClick={() => createEmployee({ name, surname, patronymic, rank, position })}
              disabled={isSubmitDisabled()}>
        {'OK'}
      </button>
      <button onClick={clearForm} disabled={isClearDisabled()}>Очистити</button>
      <button onClick={close}>Cancel</button>
    </form>
  );
}