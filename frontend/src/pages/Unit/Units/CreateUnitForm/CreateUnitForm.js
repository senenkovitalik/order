import React, { useState } from 'react';

import './CreateUnitForm.css';

function CreateUnitForm({ employees, createUnit, close, error }) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [head, setHead] = useState(employees[0]._id);

  const clearForm = () => {
    setName('');
    setShortName('');
    setHead('');
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <h3>Додати підрозділ</h3>
      {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}

      <label>
        <span className='form-field'>Назва</span>
        <input type='text' name='name' value={name} onChange={e => setName(e.target.value)}/>
      </label>
      <br/>

      <label>
        <span className='form-field'>Скорочена назва</span>
        <input type='text' name='shortName' value={shortName} onChange={e => setShortName(e.target.value)}/>
      </label>
      <br/>

      <label>
        <span className='form-field'>Керівник</span>
        <select value={head} onChange={e => setHead(e.target.value)}>
          {employees.map(employee => <option key={employee._id} value={employee._id}>
            {employee.surname} {employee.name} {employee.patronymic}
          </option>)}
        </select>
      </label>
      <br/>

      <button onClick={() => createUnit({ name, shortName, head })}
              disabled={!(name && shortName && head)}>OK
      </button>
      <button onClick={clearForm} disabled={!(name || shortName || head)}>Очистити</button>
      <button onClick={close}>Cancel</button>
    </form>
  );
}

export default CreateUnitForm;