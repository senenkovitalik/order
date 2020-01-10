import React, { useState } from 'react';

const style = {
  width: '12rem',
  display: 'inline-block'
};

function CreateUnitForm ({ heads, createUnit, hideModal }) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [head, setHead] = useState(heads[0]);

  return (
    <form>
      <h3>Додати підрозділ</h3>
      <label>
        <div style={style}>Назва</div>
        <input type='text' name='name' value={name} onChange={e => setName(e.target.value)} />
      </label>
      <br/>

      <label>
        <div style={style}>Умовне найменування</div>
        <input type='text' name='shortName' value={shortName} onChange={e => setShortName(e.target.value)} />
      </label>
      <br/>

      <label>
        <div style={style}>Керівник</div>
        <select value={head} onChange={e => setHead(e.target.value)}>
          {heads.map(head => <option key={head._id} value={head._id}>{head.surname} {head.name} {head.patronymic}</option>)}
        </select>
      </label>
      <br/>

      <input type='button' value='Submit'
             onClick={() => createUnit({ name, shortName, head })}
             disabled={!(name && shortName && head)}
      />
      <button onClick={() => hideModal()}>Cancel</button>
    </form>
  );
}

export default CreateUnitForm;