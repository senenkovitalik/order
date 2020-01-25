import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import ModalLayout from '../../../components/ModalLayout/ModalLayout';

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';
const DELETE = 'DELETE';

const headerMap = {
  CREATE: 'Додати підрозділ',
  UPDATE: 'Оновити дані про підрозділ'
};

const UNIT = loader('../UNIT.graphql');
const CREATE_UNIT = loader('./CREATE_UNIT.graphql');
const DELETE_UNIT = loader('./DELETE_UNIT.graphql');

export default function Units({ unitID, childUnits, employees, showAlert }) {
  const [isModalShown, setModalVisibility] = useState(false);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState(null);

  const [id, setID] = useState(null);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [head, setHead] = useState(!!employees.length ? employees[0]._id : null);

  const [createUnit] = useMutation(CREATE_UNIT, {
    update: (cache, { data: { createUnit } }) => {
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
          unit: Object.assign({}, unit, { childUnits: unit.childUnits.concat([createUnit]) })
        }
      });
    },
    onCompleted: () => {
      setModalVisibility(false);
      showAlert(true, 'Підрозділ додано успішно.');
    },
    onError: error => setError(error)
  });

  const [deleteUnit] = useMutation(DELETE_UNIT, {
    update: (cache, { data: { deleteUnit } }) => {
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
            childUnits: unit.childUnits.filter(childUnit => childUnit._id !== deleteUnit._id)
          })
        }
      });
    },
    onCompleted: () => showAlert(true, 'Підрозділ видалено успішно.'),
    onError: () => showAlert(false)
  });

  const showModal = () => setModalVisibility(true);

  const hideModal = () => setModalVisibility(false);

  const actionHandler = (actionType, unit) => {
    setActionType(actionType);

    if (actionType === CREATE) {
      clearForm();
      showModal();
    }

    if (actionType === UPDATE) {
      fillForm(unit);
      setID(unit._id);
      showModal();
    }

    if (actionType === DELETE) {
      const res = window.confirm(`Ви дійсно хочете видалити підрозділ '${unit.name}'?`);
      if (!res) {
        return;
      }
      deleteUnit({
        variables: {
          id: unit._id
        }
      });
    }
  };

  const submitHandler = event => {
    event.preventDefault();

    switch (actionType) {
      case DELETE:
        const result = window.confirm(`Ви дійсно хочете видалити підрозідл '${unitID}'`);
        if (!result) {
          return;
        }
        deleteUnit({
          variables: {
            id
          }
        });
        break;
      case CREATE:
        createUnit({
          variables: {
            parentUnitId: unitID,
            unit: { name, shortName, head }
          }
        });
        break;
      default:
        break;
    }
  };

  const fillForm = unit => {
    setName(unit.name);
    setShortName(unit.shortName);
    setHead(unit.head._id);
  };

  const clearForm = () => {
    setName('');
    setShortName('');
    setHead('');
  };

  return (
    <div>
      <h2>Підрозділи</h2>
      {!!childUnits.length
        ? <ul>
          {childUnits.map(unit => <li key={unit._id}>
            <Link to={`/unit/${unit._id}`}>{unit.name}</Link>
            {/*<button type='button' onClick={() => actionHandler(UPDATE, unit)}>Оновити</button>*/}
            <button type='button' onClick={() => actionHandler(DELETE, unit)}>Видалити</button>
          </li>)}
        </ul>
        : <div>Нічого не знайдено</div>}
      <button onClick={() => actionHandler(CREATE)}>Додати підрозділ</button>

      {isModalShown && <ModalLayout hide={hideModal}>
        <form onSubmit={submitHandler}>
          <h3>{headerMap[actionType]}</h3>

          {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}

          <div>
            <label>
              <span className='form-field'>Назва</span>
              <input type='text' name='name' value={name} onChange={e => setName(e.target.value)}/>
            </label>
          </div>

          <div>
            <label>
              <span className='form-field'>Скорочена назва</span>
              <input type='text' name='shortName' value={shortName} onChange={e => setShortName(e.target.value)}/>
            </label>
          </div>

          <div>
            <label>
              <span className='form-field'>Керівник</span>
              <select value={head} onChange={e => setHead(e.target.value)}>
                {/* filter already used employees */}
                {employees.map(employee => <option key={employee._id} value={employee._id}>
                  {employee.surname} {employee.name} {employee.patronymic}
                </option>)}
              </select>
            </label>
          </div>

          <button type='submit' disabled={!(name && shortName && head)}>OK</button>
          <button type='button' onClick={clearForm} disabled={!(name || shortName || head)}>Очистити</button>
          <button type='button' onClick={hideModal}>Cancel</button>
        </form>
      </ModalLayout>}
    </div>
  );
}