import React, { useState } from 'react';
import './Employees.css';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import ModalLayout from '../../../components/ModalLayout/ModalLayout';

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';
const DELETE = 'DELETE';

const headerMap = {
  CREATE: 'Додати працівника',
  UPDATE: 'Оновити дані про працівника'
};

const RANKS_AND_POSITIONS = loader('./RANKS_AND_POSITIONS.graphql');
const UNIT = loader('../UNIT.graphql');
const CREATE_EMPLOYEE = loader('./CREATE_EMPLOYEE.graphql');
const UPDATE_EMPLOYEE = loader('./UPDATE_EMPLOYEE.graphql');
const DELETE_EMPLOYEE = loader('./DELETE_EMPLOYEE.graphql');

export default function Employees({ unitID, employees, headPosition, showAlert }) {
  const [isModalShown, setModalVisibility] = useState(null);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState(null);

  const [id, setID] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [rank, setRank] = useState('');
  const [position, setPosition] = useState('');

  const [loadRanksAndPositions, { loading, data }] = useLazyQuery(RANKS_AND_POSITIONS, {
    variables: {
      parentPositionID: headPosition
    },
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    update: (cache, { data: { createEmployee } }) => {
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
            employees: unit.employees.concat([createEmployee])
          })
        }
      });
    },
    onCompleted: () => {
      setModalVisibility(false);
      showAlert(true, 'Працівника додано успішно.');
    },
    onError: error => {
      setError(error);
      showAlert(false);
    }
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    update: (cache, { data: { updateEmployee } }) => {
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
            employees: unit.employees
              .filter(({ _id }) => _id !== updateEmployee._id)
              .concat([updateEmployee])
          })
        }
      });
    },
    onCompleted: () => {
      hideModal();
      showAlert(true, 'Дані про працівника оновлено успішно.');
    },
    onError: error => {
      setError(error);
      showAlert(false);
    }
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    update: (cache, { data: { deleteEmployee } }) => {
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
          unit: Object.assign({}, unit,
            {
              employees: unit.employees.filter(({ _id }) => _id !== deleteEmployee._id)
            })
        }
      });
    },
    onCompleted: () => showAlert(true, 'Працівника видалено успішно.'),
    onError: () => showAlert(false)
  });

  const showModal = () => setModalVisibility(true);

  const hideModal = () => setModalVisibility(false);

  const fillForm = item => {
    setName(item.name);
    setSurname(item.surname);
    setPatronymic(item.patronymic);
    setRank(item.rank._id);
    setPosition(item.position._id);
  };

  const clearForm = () => {
    setName('');
    setSurname('');
    setPatronymic('');
    setRank('');
    setPosition('');
  };

  const actionHandler = (actionType, item) => {
    setActionType(actionType);

    if (actionType === CREATE || actionType === UPDATE) {
      loadRanksAndPositions();
      showModal();
    }

    if (actionType === CREATE) {
      clearForm();
    }

    if (actionType === UPDATE) {
      fillForm(item);
      setID(item._id);
    }

    if (actionType === DELETE) {
      const res = window.confirm(`Ви дійсно хочете видалити працівника '${item.surname} ${item.name} ${item.patronymic}'?`);
      if (!res) {
        return;
      }
      deleteEmployee({
        variables: {
          unitID,
          employeeID: id
        }
      });
    }
  };

  const submitHandler = event => {
    event.preventDefault();

    switch (actionType) {
      case CREATE:
        createEmployee({
          variables: {
            unitID,
            employeeData: { name, surname, patronymic, rank, position }
          }
        });
        break;
      case UPDATE:
        updateEmployee({
          variables: {
            employeeID: id,
            employeeData: { name, surname, patronymic, rank, position }
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h2>Особовий склад</h2>
      {!!employees.length
        ? <React.Fragment>
          <table className='employees'>
            <thead>
            <tr>
              <th>#</th>
              <th>Вій. звання</th>
              <th>ПІБ</th>
              <th>Посада</th>
              <th>Дія</th>
            </tr>
            </thead>
            <tbody>
            {employees.sort((a, b) => b.rank.index - a.rank.index)
              .map((employee, index) =>
                <tr key={employee._id}>
                  <td>{index + 1}</td>
                  <td>{employee.rank.shortName}</td>
                  <td>{employee.surname} {employee.name} {employee.patronymic}</td>
                  <td>{employee.position.name}</td>
                  <td>
                    <button onClick={() => actionHandler(UPDATE, employee)}>Оновити</button>
                    <button onClick={() => actionHandler(DELETE, employee)}>Видалити</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </React.Fragment>
        : <div>Нічого не знайдено</div>}
      <button onClick={() => actionHandler(CREATE)}>Додати працівника</button>

      {isModalShown && <ModalLayout hide={hideModal}>
        <form onSubmit={submitHandler}>
          <h3>{headerMap[actionType]}</h3>

          {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}

          {/* Surname */}
          <div>
            <label>
              <span className='form-field'>Прізвище</span>
              <input type='text' name='surname' value={surname} onChange={e => setSurname(e.target.value)}/>
            </label>
          </div>

          {/* Name */}
          <div>
            <label>
              <span className='form-field'>І'мя</span>
              <input type='text' name='name' value={name} onChange={e => setName(e.target.value)}/>
            </label>
          </div>

          {/* Patronymic */}
          <div>
            <label>
              <span className='form-field'>По-батькові</span>
              <input type='text' name='patronymic' value={patronymic} onChange={e => setPatronymic(e.target.value)}/>
            </label>
          </div>

          {/* Rank */}
          <div>
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
          </div>

          {/* Position */}
          <div>
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
          </div>

          <button type='submit' disabled={!(name && surname && patronymic)}>OK</button>
          <button type='button' onClick={clearForm}
                  disabled={!(name || surname || patronymic)}>Очистити
          </button>
          <button type='button' onClick={hideModal}>Cancel</button>
        </form>
      </ModalLayout>}
    </div>
  );
}