import React from 'react';
import { Link } from 'react-router-dom';
import './Unit.css';

export default function unit({unit, setEmployeeToUpdate, deleteEmployee, showCreateEmployeeModal}) {
  return (
    <div className='unit'>
      <h2>Особовий склад</h2>
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Вій. звання</th>
          <th>ПІБ</th>
          <th>Посада</th>
          <th>Operation</th>
        </tr>
        </thead>
        <tbody>
        {
          unit.employees.sort((a, b) => b.rank.index - a.rank.index)
            .map((employee, index) =>
              <tr key={employee._id}>
                <td>{index + 1}</td>
                <td>{employee.rank.shortName}</td>
                <td>
                  <Link to={`/employee/${employee._id}`}>
                    {employee.surname} {employee.name} {employee.patronymic}
                  </Link>
                </td>
                <td>{employee.position.name}</td>
                <td>
                  <button onClick={() => setEmployeeToUpdate(employee._id)}>Update</button>
                  <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
                </td>
              </tr>
            )
        }
        </tbody>
      </table>

      <button onClick={showCreateEmployeeModal}>Add Employee</button>
    </div>
  );
}
