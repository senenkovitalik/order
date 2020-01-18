import React, { useState } from 'react';
import './CreatePostForm.css';

export default function CreatePostForm({ createPost, close, error }) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [position, setPosition] = useState('');

  const clearForm = () => {
    setName('');
    setShortName('');
    setPosition('');
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <h3>Додати пост</h3>
      {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}
      <label>
        <span className='form-field'>Назва</span>
        <input type='text' name='name' value={name} onChange={e => setName(e.target.value)}
               title={'Щось типу Експедиція чи Станція'}/>
      </label>
      <br/>
      <label>
        <span className='form-field'>Скорочена назва</span>
        <input type='text' name='shortName' value={shortName}
               onChange={e => setShortName(e.target.value)}
               title={'Щось типу БП-000 чи 2БП-000'}/>
      </label>
      <br/>
      <label>
        <span className='form-field'>Найменвання номеру чергової обслуги</span>
        <input type='text' name='position' value={position}
               onChange={e => setPosition(e.target.value)}
               title={'Механік, помічник, лінійний наглядач'}/>
      </label>
      <br/>
      <button onClick={() => createPost({ name, shortName, position })} disabled={!(name && shortName && position)}>
        {'ОК'}
      </button>
      <button onClick={clearForm} disabled={!(name || shortName || position)}>Очистити</button>
      <button onClick={close}>Cancel</button>
    </form>
  );
}