import React from 'react';
import {Link} from 'react-router-dom';
import Modal from '../../Modal/Modal';
import Backdrop from '../../Backdrop/Backdrop';
import CreateEmployeeForm from "../../forms/CreateEmployeeForm/CreateEmployeeForm";
import UpdateEmployeeForm from '../../forms/UpdateEmployeeForm/UpdateEmployeeForm';
import Alert from '../../Alert/Alert';
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
          console.log(createEmployee);
          // const unit = Object.assign({}, this.state.unit);
          // const updatedEmployees = unit.employees.filter(employee => employee._id !== updateEmployee._id);
          // updatedEmployees.push(updateEmployee);
          //
          // this.setState({
          //   unit: Object.assign({}, unit, {employees: updatedEmployees}),
          //   isUpdateModalShown: false,
          //   isAlertShown: true,
          //   isAlertSuccess: true,
          // });
        })
        .catch(err => {
          // this.setState({
          //   isUpdateModalShown: false,
          //   isAlertShown: true,
          //   isAlertSuccess: false,
          // });
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
    if (employeeId) {
      return;
    }

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
        const {deleteEmployee} = res.data.data; // todo: fix this
        // update Unit
        // show Alert
        // this.setState({ unit });
      })
      .catch(err => console.error(err));
  };

  triggerCreateModal = () => this.setState(prevState => ({
    isCreateModalShown: !prevState.isCreateModalShown
  }));

  triggerUpdateModal = () => this.setState(prevState => ({
    isUpdateModalShown: !prevState.isUpdateModalShown,
  }));

  triggerAlert = () => this.setState(prevState => ({isAlertShown: !prevState.isAlertShown}));

  render() {
    if (!this.state.unit) {
      return null;
    }

    const unitName = this.state.unit ? this.state.unit.name : '';
    const employees = this.state.unit ? this.state.unit.employees : [];

    return (
      <div className='unit' style={{padding: '2rem'}}>
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

        {this.state.isAlertShown &&
        <Alert success={this.state.isAlertSuccess} close={this.triggerAlert}>
          {this.state.isAlertSuccess ? 'Дані успішно оновлено)' : 'Трапилася помилка( Зверніться до адміністратора'}
        </Alert>}

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

        <button onClick={this.triggerCreateModal}>Add Employee</button>
        <br/>
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
                _id
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
                _id
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
        variables: {id: this.props.match.params.id}
      };
      axios.get('/graphql', {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {'Authorization': `Bearer ${token}`}
      })
        .then(res => {
          const {unit} = res.data.data;
          this.setState({unit});
        })
        .catch(err => console.error(err));
    }
  }
}
