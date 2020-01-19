import React, { useState } from 'react';
import './Employees.css';
import { useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import Backdrop from '../../../components/Backdrop/Backdrop';
import Modal from '../../../components/Modal/Modal';
import CreateEmployeeForm from './CreateEmployeeForm/CreateEmployeeForm';

const UNIT = loader('../UNIT.graphql');
const CREATE_EMPLOYEE = loader('./CREATE_EMPLOYEE.graphql');
const DELETE_EMPLOYEE = loader('./DELETE_EMPLOYEE.graphql');

export default function Employees({ unitID, employees, headPosition, showAlert }) {
  const [isCreateModalShown, setCreatModalVisibility] = useState(null);
  const [error, setError] = useState(null);

  const [createEmployeeMutation] = useMutation(CREATE_EMPLOYEE, {
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
      setCreatModalVisibility(false);
      showAlert(true, 'Працівника додано успішно.');
    },
    onError: error => {
      setError(error);
      showAlert(false);
    }
  });

  const [deleteEmployeeMutation] = useMutation(DELETE_EMPLOYEE, {
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

  const createEmployee = employeeData => createEmployeeMutation({
    variables: {
      unitID,
      employeeData,
    }
  });

  const deleteEmployee = ({_id, name, surname, patronymic}) => {
    const result = window.confirm(`Ви дійсно хочете видалити працівника '${surname} ${name} ${patronymic}'`);
    if (!result) {
      return;
    }
    return deleteEmployeeMutation({
      variables: {
        unitID,
        employeeID: _id
      }
    });
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
                    <button onClick={() => deleteEmployee(employee)}>Delete</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </React.Fragment>
        : <div>Нічого не знайдено</div>}
      <button onClick={() => setCreatModalVisibility(true)}>Додати працівника</button>

      {isCreateModalShown && <React.Fragment>
        <Backdrop closeModal={() => setCreatModalVisibility(false)}/>
        <Modal>
          <CreateEmployeeForm headPosition={headPosition} createEmployee={createEmployee}
                              close={() => setCreatModalVisibility(false)} error={error}/>
        </Modal>
      </React.Fragment>}
    </div>
  );
}