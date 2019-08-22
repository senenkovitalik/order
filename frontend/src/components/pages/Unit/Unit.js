import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../Modal/Modal';
import Backdrop from '../../Backdrop/Backdrop';
import axios from 'axios';

import './Unit.css';
import FormUpdateEmployee from '../../forms/FormUpdateEmployee/FormUpdateEmployee';

export default class Unit extends React.Component {
  state = {
    unit: null,
    shortPositionName: true,
    isModalShown: false,
    employeeToUpdate: null
  };

  triggerPositionView = () => {
    this.setState(prevState => ({ shortPositionName: !prevState.shortPositionName }));
  };

  setEmployeeToUpdate = employeeId => {
    this.setState({
      employeeToUpdate: this.state.unit.employees.find(e => e._id === employeeId),
      isModalShown: true
    });
  };

  updateEmployee = async data => {
    // check if there address entities
    // update them first
    // then update employee
  };

  deleteEmployee = employeeId => {
    console.log(`Delete Employee ${employeeId}`);
  };

  triggerModal = () => this.setState(prevState => ({ isModalShown: !prevState.isModalShown }));

  render() {
    if (!this.state.unit) {
      return null;
    }

    const unitName = this.state.unit ? this.state.unit.name : '';
    const employees = this.state.unit ? this.state.unit.employees : [];

    return (
      <div className='unit' style={{ padding: '2rem' }}>
        {
          this.state.isModalShown &&
          <React.Fragment>
            <Backdrop/>
            <Modal>
              <FormUpdateEmployee employee={this.state.employeeToUpdate}
                                  positions={this.state.unit.head.position.juniorPositions}
                                  updateEmployee={this.updateEmployee}
                                  closeModal={this.triggerModal}/>
            </Modal>
          </React.Fragment>
        }

        <h2>Особовий склад підрозділу: {unitName}</h2>
        <table>
          <thead>
          <tr>
            <th>#</th>
            <th>Вій. звання</th>
            <th>ПІБ</th>
            <th>Посада <input type='button'
                              onClick={this.triggerPositionView}
                              value={this.state.shortPositionName ? 'Повна' : 'Скорочена'}/>
            </th>
            <th>Operation</th>
          </tr>
          </thead>
          <tbody>
          {
            employees.sort((a, b) => b.rank.index - a.rank.index)
              .map((employee, index) =>
                <tr key={employee._id}>
                  <td>{index + 1}</td>
                  <td>{employee.rank.shortName}</td>
                  <td>
                    <Link to={`/employee/${employee._id}`}>
                      {employee.surname} {employee.name} {employee.patronymic}
                    </Link>
                  </td>
                  {
                    this.state.shortPositionName
                      ? <td>{employee.position.shortName}</td>
                      : <td>{employee.position.name}</td>
                  }
                  <td>
                    <button onClick={() => this.setEmployeeToUpdate(employee._id)}>Update</button>
                    <button onClick={() => this.deleteEmployee(employee._id)}>Delete</button>
                  </td>
                </tr>
              )
          }
          </tbody>
        </table>

        <Link to={`${this.props.location.pathname}/order_chart`}>Графік чергування</Link>
      </div>
    );
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (this.props.match.params.id && token) {
      const requestBody = {
        query: `query Unit($id: String!) {
          unit(id: $id) {
            _id
            name
            head {
              _id
              name
              surname
              patronymic
              rank { name }
              position { 
                name
                juniorPositions {
                  _id
                  name
                }
              }
            }
            employees {
              _id
              rank {
                _id
                index
                name
                shortName
              }
              position {
                name
                shortName
              }
              name
              surname
              patronymic
              dateOfBirth
              addressOfResidence {
                region
                district
                city
                village
                urbanVillage
                street
                houseNumber
                apartmentNumber
              }
              registrationAddress {
                region
                district
                city
                village
                urbanVillage
                street
                houseNumber
                apartmentNumber
              }
            }
          }
        }`,
        variables: { id: this.props.match.params.id }
      };
      axios.get('/graphql', {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          const { unit } = res.data.data;
          this.setState({ unit });
        })
        .catch(err => console.error(err));
    }
  }
}
