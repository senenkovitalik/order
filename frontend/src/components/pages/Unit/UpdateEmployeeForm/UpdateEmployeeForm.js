import React, { useState } from 'react';
import convertDate from '../../../../utils';
import { addressData } from '../../../data';
import { useQuery } from '@apollo/react-hooks';
import { POSITIONS, RANKS } from './queries';

import './EmployeeUpdateForm.css';

export default function UpdateEmployeeForm({ employee, headPosition, closeModal }) {

  const [surname, setSurname] = useState(employee.surname);
  const [name, setName] = useState(employee.name);
  const [patronymic, setPatronymic] = useState(employee.patronymic);
  const [rank, setRank] = useState(employee.rank._id);
  const [position, setPosition] = useState(employee.position._id);
  const [dateOfBirth, setDateOfBirth] = useState(employee.dateOfBirth);
  const [addressOfResidence, setAddressOfResidence] = useState(employee.addressOfResidence);
  const [registrationAddress, setRegistrationAddress] = useState(employee.registrationAddress);

  const handleDate = ({ target: { value } }) => {
    const parts = value.split('-');
    setDateOfBirth(new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])));
  };

  // todo: refactor
  const handleAddressOfResidence = ({ target: { name, value } }) =>
    setAddressOfResidence(Object.assign({}, addressOfResidence, { [name]: value }));

  // todo: refactor
  const handleRegistrationAddress = ({ target: { name, value } }) =>
    setRegistrationAddress(Object.assign({}, registrationAddress, { [name]: value }));

  const addressMap = [
    {
      blockName: 'Адреса проживання',
      data: addressOfResidence,
      handler: handleAddressOfResidence
    },
    {
      blockName: 'Адреса рєєстрації',
      data: registrationAddress,
      handler: handleRegistrationAddress
    }
  ];

  const { loading, data } = useQuery(RANKS, {
    onError: error => {
      console.log(error);
    }
  });

  const { data: positionsData, loading: positionLoading } = useQuery(POSITIONS, {
    variables: {
      id: headPosition
    },
    onError: error => {
      console.log(error);
    }
  });

  return (
    <form>
      <h3>Оновити дані про працівника: {surname} {name} {patronymic}</h3>

      {/* Surname */}
      <div>
        <label>
          <span className='field-name'>Прізвище</span>
          <input className='field-input' type='text' defaultValue={surname} onChange={e => setSurname(e.target.value)}/>
        </label>
      </div>

      {/* Name */}
      <div>
        <label>
          <span className='field-name'>Ім`я</span>
          <input className='field-input' type='text' defaultValue={name} onChange={e => setName(e.target.value)}/>
        </label>
      </div>

      {/* Patronymic */}
      <div>
        <label>
          <span className='field-name'>Побатькові</span>
          <input className='field-input' type='text' defaultValue={patronymic}
                 onChange={e => setPatronymic(e.target.value)}/>
        </label>
      </div>

      {/* Rank */}
      <div>
        <label>
          <span className='field-name'>Військове звання</span>
          {
            loading
              ? <span>Завантаження...</span>
              : <select className='field-input' value={rank} onChange={e => setRank(e.target.value)}>
                {data.ranks
                  .sort((a, b) => a.index - b.index)
                  .map(rank => <option key={rank._id} value={rank._id}>{rank.name}</option>)}
              </select>
          }
        </label>
      </div>

      {/* Position */}
      <div>
        <label>
          <span className='field-name'>Посада</span>
          {positionLoading
            ? <div>Завантаження...</div>
            : <select className='field-input' defaultValue={position} onChange={e => setPosition(e.target.value)}>
              {positionsData.position.juniorPositions.map(position =>
                <option key={position._id} value={position._id}>{position.name}</option>)}
            </select>}
        </label>
      </div>

      {/* Birthday */}
      <div>
        <label>
          <span className='field-name'>День народження</span>
          <input className='field-input' type="date" defaultValue={convertDate(dateOfBirth)} onChange={handleDate}/>
        </label>
      </div>

      {addressMap.map(({ blockName, data, handler }, i) => <React.Fragment key={i}>
        <div>
          <b>{blockName}</b>
        </div>
        {addressData.map((item, i) => <div key={i}>
          <label>
            <span className='field-name'>{item.title}</span>
            <input className='field-input' type='text' name={item.field} defaultValue={data ? data[item.field] : ''}
                   onChange={handler}/>
          </label>
        </div>)}
      </React.Fragment>)}

      <button>Update</button>
      <button onClick={closeModal}>Cancel</button>
    </form>
  );
}