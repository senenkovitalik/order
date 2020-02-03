import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import ModalLayout from '../../../components/ModalLayout/ModalLayout';

import './Posts.css';
import Table from '../../../components/Table/Table';

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';
const DELETE = 'DELETE';

const headerMap = {
  CREATE: 'Додати пост',
  UPDATE: 'Оновити дані про пост'
};

const UNIT = loader('../UNIT.graphql');
const CREATE_POST = loader('./CREATE_POST.graphql');
const UPDATE_POST = loader('./UPDATE_POST.graphql');
const DELETE_POST = loader('./DELETE_POST.graphql');

export default function Posts({ unitID, posts, pathname, showAlert }) {
  const [isModalShown, setModalVisibility] = useState(false);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState(null);

  const [id, setID] = useState(null);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [position, setPosition] = useState('');

  const [createPost] = useMutation(CREATE_POST, {
    update: (cache, { data: { createPost } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: unitID
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: unitID
        },
        data: {
          unit: Object.assign({}, unit, { posts: unit.posts.concat(createPost) })
        }
      });
    },
    onCompleted: () => {
      showAlert(true, 'Пост додано успішно.');
      hideModal();
    },
    onError: error => {
      showAlert(false);
      setError(error);
    }
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    update: (cache, { data: { updatePost } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: unitID
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: unitID
        },
        data: {
          unit: Object.assign({}, unit, {
            posts: unit.posts
              .filter(({ _id }) => _id !== updatePost._id)
              .concat([updatePost])
          })
        }
      });
    },
    onCompleted: () => {
      showAlert(true, 'Пост оновлено успішно.');
      hideModal();
    },
    onError: error => {
      showAlert(false);
      setError(error);
    }
  });

  const [deletePost] = useMutation(DELETE_POST, {
    update: (cache, { data: { deletePost } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: unitID
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: unitID
        },
        data: {
          unit: Object.assign(
            {},
            unit,
            { posts: unit.posts.filter(({ _id }) => _id !== deletePost._id) })
        }
      });
    },
    onCompleted: () => showAlert(true, 'Пост видалено успішно.'),
    onError: () => showAlert(false)
  });

  const showModal = () => setModalVisibility(true);

  const hideModal = () => setModalVisibility(false);

  const fillForm = item => {
    setName(item.name);
    setShortName(item.shortName);
    setPosition(item.position);
  };

  const clearForm = () => {
    setName('');
    setShortName('');
    setPosition('');
  };

  const actionHandler = (actionType, post) => {
    setActionType(actionType);

    if (actionType === CREATE) {
      clearForm();
      showModal();
    }

    if (actionType === UPDATE) {
      fillForm(post);
      setID(post._id);
      showModal();
    }

    if (actionType === DELETE) {
      const res = window.confirm(`Ви дійсно хочете видалити підрозділ '${post.name}'?`);
      if (!res) {
        return;
      }
      deletePost({
        variables: {
          unitID,
          postID: post._id
        }
      });
    }
  };

  const submitHandler = event => {
    event.preventDefault();

    switch (actionType) {
      case CREATE:
        createPost({
          variables: {
            unitID: unitID,
            postData: { name, shortName, position }
          }
        });
        break;
      case UPDATE:
        updatePost({
          variables: {
            postID: id,
            postData: { name, shortName, position }
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h2>Бойові пости</h2>
      {!!posts.length
        ? <Table headers={['#', 'Пост', 'Дія']}>
          {posts.map((item, i) => <tr key={item._id}>
            <td>{i + 1}</td>
            <td><Link to={`${pathname}/posts/${item._id}`}>{item.shortName} {item.name}</Link></td>
            <td>
              <button onClick={() => actionHandler(UPDATE, item)}>Оновити</button>
              <button onClick={() => actionHandler(DELETE, item)}>Видалити</button>
            </td>
          </tr>)}
        </Table>
        : <div>Нічого не знайдено</div>}

      <button onClick={() => actionHandler(CREATE)}>Додати пост</button>

      {isModalShown && <ModalLayout hide={hideModal}>
        <form onSubmit={submitHandler}>
          <h3>{headerMap[actionType]}</h3>
          {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}

          <div>
            <label>
              <span className='form-field'>Назва</span>
              <input type='text' value={name} onChange={e => setName(e.target.value)}
                     title={'Щось типу Експедиція чи Станція'}/>
            </label>
          </div>

          <div>
            <label>
              <span className='form-field'>Скорочена назва</span>
              <input type='text' value={shortName} onChange={e => setShortName(e.target.value)}
                     title={'Щось типу БП-000 чи 2БП-000'}/>
            </label>
          </div>

          <div>
            <label>
              <span className='form-field'>Найменвання номеру чергової обслуги</span>
              <input type='text' value={position} onChange={e => setPosition(e.target.value)}
                     title={'Механік, помічник, лінійний наглядач'}/>
            </label>
          </div>

          <button type='submit' disabled={!(name && shortName && position)}>OK</button>
          <button type='button' onClick={clearForm} disabled={!(name || shortName || position)}>Очистити</button>
          <button type='button' onClick={hideModal}>Відмінити</button>
        </form>
      </ModalLayout>}
    </div>
  );
}