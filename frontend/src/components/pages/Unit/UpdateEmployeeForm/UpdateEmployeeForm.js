import React, { useState } from 'react';
import convertDate from '../../../../utils';
import { addressData } from '../../../data';
import { useQuery } from '@apollo/react-hooks';
import { RANKS } from './queries';

export default function UpdateEmployeeForm({ employee, positions = [], closeModal }) {

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

  const { loading, data } = useQuery(RANKS, {
    onError: error => {
      console.log(error);
    }
  });

  return (
    <form className='employee-update-form'>
      <h3>Оновити дані про працівника: {surname} {name} {patronymic}</h3>

      {/* Surname */}
      <div>
        <label>
          <span>Прізвище</span>
          <input type='text' defaultValue={surname} onChange={e => setSurname(e.target.value)}/>
        </label>
      </div>

      {/* Name */}
      <div>
        <label>
          <span>Ім`я</span>
          <input type='text' defaultValue={name} onChange={e => setName(e.target.value)}/>
        </label>
      </div>

      {/* Patronymic */}
      <div>
        <label>
          <span>Побатькові</span>
          <input type='text' defaultValue={patronymic} onChange={e => setPatronymic(e.target.value)}/>
        </label>
      </div>

      {/* Rank */}
      <div>
        <label>
          <span>Військове звання</span>
          {
            loading
              ? <span>Завантаження...</span>
              : <select value={rank} onChange={e => setRank(e.target.value)}>
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
          <span>Посада</span>
          <select defaultValue={position} onChange={e => setPosition(e.target.value)}>
            {positions.map(position => <option key={position._id} value={position._id}>{position.name}</option>)}
          </select>
        </label>
      </div>

      {/* Birthday */}
      <div>
        <label>
          <span>День народження</span>
          <input type="date" defaultValue={convertDate(dateOfBirth)} onChange={handleDate}/>
        </label>
      </div>

      {
        [
          { blockName: 'Адреса проживання', data: addressOfResidence, handler: handleAddressOfResidence },
          { blockName: 'Адреса рєєстрації', data: registrationAddress, handler: handleRegistrationAddress }
        ].map(({ blockName, data, handler }, i) => <React.Fragment key={i}>
          <div>
            <b>{blockName}</b>
          </div>
          {addressData.map((item, i) => <div key={i}>
            <label>
              <span>{item.title}</span>
              <input type='text' name={item.field} defaultValue={data ? data[item.field] : ''} onChange={handler}/>
            </label>
          </div>)}
        </React.Fragment>)
      }

      <button>Update</button>
      <button onClick={closeModal}>Cancel</button>
    </form>
  );
}