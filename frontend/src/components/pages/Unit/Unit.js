import React from 'react';
import {Link} from 'react-router-dom';
import Modal from '../../Modal/Modal';
import Backdrop from '../../Backdrop/Backdrop';
import CreateEmployeeForm from '../../forms/CreateEmployeeForm/CreateEmployeeForm';
import UpdateEmployeeForm from '../../forms/UpdateEmployeeForm/UpdateEmployeeForm';
import axios from 'axios';
import './Unit.css';

export default class Unit extends React.Component {
  state = {
    unit: null,
    shortPositionName: true,
    isUpdateModalShown: false,
    isCreateModalShown: false,
    isAlertShown: false,
    isAlertSuccess: false,
    employeeToUpdate: null
  };

  triggerPositionView = () => {
    this.setState(prevState => ({shortPositionName: !prevState.shortPositionName}));
  };

  setEmployeeToUpdate = employeeId => {
    this.setState({
      employeeToUpdate: this.state.unit.employees.find(e => e._id === employeeId),
      isUpdateModalShown: true
    });
  };

  createEmployee = employeeData => {
    const {employee, addressOfResidence, registrationAddress} = employeeData;
    employee.unit = this.state.unit._id;
    const token = localStorage.getItem('token');
    if (employee || addressOfResidence || registrationAddress) {
      const requestBody = {
        query: `
          mutation CreateEmployee(
            $employee: EmployeeInput!,
            $addressOfResidence: AddressInput,
            $registrationAddress: AddressInput
          ) {
            createEmployee(
              employee: $employee,
              addressOfResidence: $addressOfResidence,
              registrationAddress: $registrationAddress
            ) {
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
        }`,
        variables: {employee, addressOfResidence, registrationAddress}
      };
      axios.post('/graphql', {}, {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {'Authorization': `Bearer ${token}`}
      })
        .then(res => {
          const {createEmployee} = res.data.data;
          const unit = Object.assign({}, this.state.unit);
          const updatedEmployees = unit.employees.filter(employee => employee._id !== createEmployee._id);
          updatedEmployees.push(createEmployee);

          this.setState({
            unit: Object.assign({}, unit, {employees: updatedEmployees}),
            isCreateModalShown: false,
            isAlertShown: true,
            isAlertSuccess: true,
          });
        })
        .catch(err => {
          this.setState({
            isCreateModalShown: false,
            isAlertShown: true,
            isAlertSuccess: false,
          });
          console.error(err)
        });
    }
  };

  updateEmployee = employeeData => {
    const {data, addressOfResidence, registrationAddress} = employeeData;
    const token = localStorage.getItem('token');
    if (data || addressOfResidence || registrationAddress) {
      const requestBody = {
        query: `
          mutation UpdateEmployee(
            $id: ID!,
            $data: EmployeeInput,
            $addressOfResidence: AddressInput,
            $registrationAddress: AddressInput
          ) {
            updateEmployee(
              id: $id,
              data: $data,
              addressOfResidence: $addressOfResidence,
              registrationAddress: $registrationAddress
            ) {
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
        }`,
        variables: {id: this.state.employeeToUpdate._id, data, addressOfResidence, registrationAddress}
      };
      axios.post('/graphql', {}, {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {'Authorization': `Bearer ${token}`}
      })
        .then(res => {
          const {updateEmployee} = res.data.data;
          const unit = Object.assign({}, this.state.unit);
          const updatedEmployees = unit.employees.filter(employee => employee._id !== updateEmployee._id);
          updatedEmployees.push(updateEmployee);

          this.setState({
            unit: Object.assign({}, unit, {employees: updatedEmployees}),
            isUpdateModalShown: false,
            isAlertShown: true,
            isAlertSuccess: true,
          });
        })
        .catch(err => {
          this.setState({
            isUpdateModalShown: false,
            isAlertShown: true,
            isAlertSuccess: false,
          });
          console.error(err)
        });
    }
  };

  deleteEmployee = employeeId => {
    const token = localStorage.getItem('token');
    const requestBody = {
      query: `mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id) {
            _id
          }
        }`,
      variables: {id: employeeId}
    };

    axios.post('/graphql', {}, {
      baseURL: 'http://localhost:3001/',
      params: requestBody,
      headers: {'Authorization': `Bearer ${token}`}
    })
      .then(res => {
        const {deleteEmployee} = res.data.data;
        // update Unit
        const unit = Object.assign({}, this.state.unit);
        unit.employees = unit.employees.filter(e => e._id !== deleteEmployee._id);
        // show Alert
        this.setState({
          unit,
          isAlertShown: true,
          isAlertSuccess: true
        });
      })
      .catch(err => {
        this.setState({
          isAlertShown: true,
          isAlertSuccess: false
        });
        console.error(err);
      });
  };

  triggerCreateModal = () => this.setState(prevState => ({
    isCreateModalShown: !prevState.isCreateModalShown
  }));

  triggerUpdateModal = () => this.setState(prevState => ({
    isUpdateModalShown: !prevState.isUpdateModalShown,
  }));

  render() {
    return this.props.unit ? (
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
            this.props.unit.employees.sort((a, b) => b.rank.index - a.rank.index)
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
                    <button onClick={() => this.setEmployeeToUpdate(employee._id)}>Update</button>
                    <button onClick={() => this.deleteEmployee(employee._id)}>Delete</button>
                  </td>
                </tr>
              )
          }
          </tbody>
        </table>

        <button onClick={this.triggerCreateModal}>Add Employee</button>

        {
          (this.state.isUpdateModalShown || this.state.isCreateModalShown) &&
          <React.Fragment>
            <Backdrop/>
            <Modal>
              {this.state.isUpdateModalShown &&
              <UpdateEmployeeForm employee={this.state.employeeToUpdate}
                                  positions={this.state.unit.head.position.juniorPositions}
                                  updateEmployee={this.updateEmployee}
                                  closeModal={this.triggerUpdateModal}/>
              }
              {this.state.isCreateModalShown &&
              <CreateEmployeeForm positions={this.state.unit.head.position.juniorPositions}
                                  createEmployee={this.createEmployee}
                                  closeModal={this.triggerCreateModal} />
              }
            </Modal>
          </React.Fragment>
        }
      </div>
    ) : null;
  }
}
