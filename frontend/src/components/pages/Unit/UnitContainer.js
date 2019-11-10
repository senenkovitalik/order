import React from 'react';
import Posts from '../Posts/Posts';
import Unit from './Unit';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../Spiner/Spinner';
import Alert from '../../Alert/Alert';
import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import UpdateEmployeeForm from '../../forms/UpdateEmployeeForm/UpdateEmployeeForm';
import CreateEmployeeForm from '../../forms/CreateEmployeeForm/CreateEmployeeForm';

class UnitContainer extends React.Component {
  state = {
    loading: false,
    unit: null,
    employeeToUpdate: null,
    isCreateModalShown: false,
    isAlertShown: false,
    isAlertSuccess: true,
    alertContent: ''
  };

  // unit
  setEmployeeToUpdate = employeeId => {
    this.setState({
      employeeToUpdate: this.state.unit.employees.find(e => e._id === employeeId),
    });
  };

  closeUpdateEmployeeModal = () => {
    this.setState({
      employeeToUpdate: null
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
          console.error(err);
        });
    }
  };

  triggerCreateEmployeeModal = () => {
    this.setState(prevState => ({
      isCreateModalShown: prevState.isCreateModalShown
    }))
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
            employeeToUpdate: null,
            isAlertShown: true,
            isAlertSuccess: true,
            alertContent: 'Успішно оновлено'
          });
        })
        .catch(err => {
          this.setState({
            employeeToUpdate: null,
            isAlertShown: true,
            isAlertSuccess: false,
            alertContent: 'Shit happens('
          });
          console.error(err);
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

  // post
  addPost = postName => {
    const {_id: unitId} = this.state.unit;
    const requestBody = {
      query: `
          mutation CreatePost($unitId: ID!, $postName:String!) {
            createPost(unitId: $unitId, postName: $postName) {
              _id
              name
            }
          }
        `,
      variables: {
        unitId,
        postName
      }
    };

    axios.post('/graphql',
      {},
      {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        const post = res.data.data.createPost;
        this.setState(prevState => ({
          posts: [...prevState.posts, post],
          isAlertShown: true,
          isAlertSuccess: true,
          alertContent: 'Пост вдало додано'
        }));
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAlertShown: true,
          isAlertSuccess: false,
          alertContent: 'Щось трапилося. Звернуться до адміністратора.'
        });
      });
  };

  deletePost = postId => {
    const {_id: unitId} = this.state.unit;
    const requestBody = {
      query: `
          mutation CreatePost($unitId: ID!, $postId: ID!) {
            deletePost(unitId: $unitId, postId: $postId) {
              _id
            }
          }
        `,
      variables: {
        unitId,
        postId
      }
    };

    axios.post('/graphql',
      {},
      {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        const {_id} = res.data.data.deletePost;
        this.setState(prevState => ({
          posts: [...prevState.posts.filter(e => e._id !== _id)],
          isAlertShown: true,
          isAlertSuccess: true,
          alertContent: 'Пост вдало видалено'
        }));
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAlertShown: true,
          isAlertSuccess: false,
          alertContent: 'Щось трапилося. Звернуться до адміністратора.'
        });
      });
  };

  triggerAlert = () => this.setState(prevState => ({isAlertShown: !prevState.isAlertShown}));

  render() {
    return (
      <React.Fragment>
        {
          this.state.isAlertShown &&
          <div style={{paddingTop: '1rem'}}>
            <Alert success={this.state.isAlertSuccess}
                   dismiss={this.triggerAlert}>
              {this.state.alertContent}
            </Alert>
          </div>
        }
        {
          this.state.loading && <div style={{display: 'flex', justifyContent: 'center', padding: '3rem'}}>
            <Spinner/>
          </div>
        }
        {
          this.state.unit && <React.Fragment>
            <h1>{this.state.unit.name}</h1>
            <Unit unit={this.state.unit}
                  setEmployeeToUpdate={this.setEmployeeToUpdate}
                  showCreateEmployeeModal={this.triggerCreateEmployeeModal}
                  updateEmployee={this.updateEmployee}
                  deleteEmployee={this.deleteEmployee}/>
            <Posts posts={this.state.unit.posts}
                   addPost={this.addPost}
                   deletePost={this.deletePost}/>
            {
              (this.state.employeeToUpdate || this.state.isCreateModalShown) &&
              <React.Fragment>
                <Backdrop/>
                <Modal>
                  {this.state.employeeToUpdate &&
                  <UpdateEmployeeForm employee={this.state.employeeToUpdate}
                                      positions={this.state.unit.head.position.juniorPositions}
                                      updateEmployee={this.updateEmployee}
                                      closeModal={this.closeUpdateEmployeeModal}/>
                  }
                  {this.state.isCreateModalShown &&
                  <CreateEmployeeForm positions={this.state.unit.head.position.juniorPositions}
                                      createEmployee={this.createEmployee}
                                      closeModal={this.triggerCreateEmployeeModal}/>
                  }
                </Modal>
              </React.Fragment>
            }
          </React.Fragment>
        }
      </React.Fragment>
    );
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const {unitId} = this.props.match.params;
    if (unitId && token) {
      this.setState({
        loading: true
      });
      const requestBody = {
        query: `query Unit($id: ID!) {
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
            posts {
              _id
              name
            }
          }
        }`,
        variables: {id: unitId}
      };
      axios.get('/graphql', {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: {'Authorization': `Bearer ${token}`}
      })
        .then(res => {
          const {unit} = res.data.data;
          this.setState({
            unit,
            loading: false
          });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            isAlertShown: true,
            isAlertSuccess: false,
            alertContent: 'Щось трапилося. Звернуться до адміністратора.'
          })
        });
    }
  }
}

export default withRouter(UnitContainer);