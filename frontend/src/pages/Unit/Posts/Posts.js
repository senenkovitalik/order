import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Posts({ posts, pathname, createPost, deletePost }) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [position, setPosition] = useState('');

  const clearForm = () => {
    setName('');
    setShortName('');
    setPosition('');
  };

  return (
    <div>
      <h2>Бойові пости</h2>
      {!!posts.length
        ? <ul>
          {posts.map(({ _id, name }) => <li key={_id}>
            <Link to={`${pathname}/posts/${_id}`}>{name}</Link>
            <button onClick={() => deletePost(_id)}>Delete
            </button>
          </li>)}
        </ul>
        : <div>Нічого не знайдено</div>}

      <form onSubmit={e => e.preventDefault()}>
        Додати пост<br/>
        <label>
          Назва{' '}
          <input type='text' name='name' value={name} onChange={e => setName(e.target.value)}
                 title={'Щось типу Експедиція чи Станція'}/>
        </label>
        <br/>
        <label>
          Скорочена назва{' '}
          <input type='text' name='shortName' value={shortName} onChange={e => setShortName(e.target.value)}
                 title={'Щось типу БП-000 чи 2БП-000'}/>
        </label>
        <br/>
        <label>
          Найменвання номеру чергової обслуги{' '}
          <input type='text' name='position' value={position} onChange={e => setPosition(e.target.value)}
                 title={'Механік, помічник, лінійний наглядач'}/>
        </label>
        <br/>
        <button onClick={() => createPost({ name, shortName, position })}
                disabled={!(name && shortName && position)}>ОК
        </button>
        <button onClick={clearForm} disabled={!(name || shortName || position)}>Очистити</button>
      </form>
    </div>
  );
}