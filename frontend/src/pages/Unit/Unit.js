import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import Spinner from '../../components/Spiner/Spinner';
import Alert from '../../components/Alert/Alert';
import Backdrop from '../../components/Backdrop/Backdrop';
import Modal from '../../components/Modal/Modal';
import UpdateEmployeeForm from './UpdateEmployeeForm/UpdateEmployeeForm';
import CreateEmployeeForm from './CreateEmployeeForm/CreateEmployeeForm';
import { CREATE_EMPLOYEE, DELETE_EMPLOYEE } from './queries';
import './Unit.css';
import Posts from './Posts/Posts';
import Units from './Units/Units';

const UNIT = loader('./queries/UNIT.graphql');
const CREATE_POST = loader('./queries/CREATE_POST.graphql');
const DELETE_POST = loader('./queries/DELETE_POST.graphql');

function Unit(props) {
  const [isAlertShown, setAlertVisibility] = useState(false);
  const [isAlertSuccess, setSuccessAlertState] = useState(true);
  const [alertContent, setAlertContent] = useState('Something happens');
  const [employeeToUpdate, setEmployee] = useState(null);
  const [isCreateModalShown, setCreatModalVisibility] = useState(null);

  const { loading, data } = useQuery(UNIT, {
    variables: {
      id: props.match.params.unitId
    },
    onError: error => {
      setAlertVisibility(true);
      setSuccessAlertState(false);
    }
  });
  const [createEmployeeMutation] = useMutation(CREATE_EMPLOYEE);
  const [deleteEmployeeMutation] = useMutation(DELETE_EMPLOYEE);
  const [createPostMutation] = useMutation(CREATE_POST, {
    update: (cache, { data: { createPost } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: data.unit._id
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: data.unit._id
        },
        data: {
          unit: Object.assign({}, unit, { posts: unit.posts.concat(createPost) })
        }
      });
    },
    onCompleted: () => showAlert(true, 'Пост додано успішно.'),
    onError: () => showAlert(false)
  });
  const [deletePostMutation] = useMutation(DELETE_POST, {
    update: (cache, { data: { deletePost } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: data.unit._id
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: data.unit._id
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

  // unit
  const createEmployee = employeeData => {
    const { employee, addressOfResidence, registrationAddress } = employeeData;
    employee.unit = data.unit._id;
    createEmployeeMutation({
      variables: {
        employee,
        addressOfResidence,
        registrationAddress
      },
      update: (cache, { data: { createEmployee } }) => {
        const { unit } = cache.readQuery({
          query: UNIT,
          variables: {
            id: data.unit._id
          }
        });
        cache.writeQuery({
          query: UNIT,
          variables: {
            id: data.unit._id
          },
          data: {
            unit: Object.assign({}, unit, { employees: unit.employees.concat(createEmployee) })
          }
        });

        // code below this must be called in onCompleted handler
        // try to refactor at 3.1.0 release
        setCreatModalVisibility(false);
        showAlert(true, 'Працівника додано успішно.');
      },
      onError: error => {
        console.error(error);
        setCreatModalVisibility(false);
        showAlert(false);
      }
    });
  };

  const deleteEmployee = employeeId => deleteEmployeeMutation({
    variables: {
      id: employeeId
    },
    update: (cache, { data: { deleteEmployee } }) => {
      const { unit } = cache.readQuery({
        query: UNIT,
        variables: {
          id: data.unit._id
        }
      });
      cache.writeQuery({
        query: UNIT,
        variables: {
          id: data.unit._id
        },
        data: {
          unit: Object.assign(
            {},
            unit,
            { employees: unit.employees.filter(({ _id }) => _id !== deleteEmployee._id) })
        }
      });

      // code below this must be called in onCompleted handler
      // try to refactor at 3.1.0 release
      showAlert(true, 'Працівника видалено успішно.');
    },
    onError: error => {
      console.error(error);
      showAlert(false);
    }
  });

  // todo
  const updateEmployee = employeeData => {
    const { data, addressOfResidence, registrationAddress } = employeeData;
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
        variables: { id: this.state.employeeToUpdate._id, data, addressOfResidence, registrationAddress }
      };
      axios.post('/graphql', {}, {
        baseURL: 'http://localhost:3001/',
        params: requestBody,
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          const { updateEmployee } = res.data.data;
          const unit = Object.assign({}, this.state.unit);
          const updatedEmployees = unit.employees.filter(employee => employee._id !== updateEmployee._id);
          updatedEmployees.push(updateEmployee);

          this.setState({
            unit: Object.assign({}, unit, { employees: updatedEmployees }),
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

  // post
  const createPost = postData => {
    createPostMutation({
      variables: {
        unitId: data.unit._id,
        post: postData
      }
    });
  };

  const deletePost = id => {
    deletePostMutation({
      variables: {
        unitId: data.unit._id,
        postId: id
      }
    });
  };

  // alerts
  const showAlert = (success, content = 'Something happens') => {
    setAlertVisibility(true);
    setSuccessAlertState(success);
    setAlertContent(content);
  };

  const closeAlert = () => setAlertVisibility(false);

  const fallbackMessage = <div>Нічого не знайдено</div>;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner/>
      </div>
    );
  }

  const { name, head, employees } = data.unit;

  return (
    <React.Fragment>
      {isAlertShown && <div style={{ paddingTop: '1rem' }}>
        <Alert success={isAlertSuccess}
               dismiss={closeAlert}>
          {alertContent}
        </Alert>
      </div>}
      {data && data.unit && <React.Fragment>
        <h1>{name}</h1>

        {/* Head */}
        <div>
          {head.position.name}<br/>
          <Link to={`/employee/${data.unit.head._id}`}>
            {head.rank.name} {head.surname} {head.name} {head.patronymic}
          </Link>
        </div>

        {/* Employees */}
        {<div>
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
                        <td>{employee.position.name}</td>
                        <td>
                          <button onClick={() => setEmployee(employee)}>Update</button>
                          <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
                        </td>
                      </tr>
                    )
                }
                </tbody>
              </table>
            </React.Fragment>
            : fallbackMessage}
          <button onClick={() => setCreatModalVisibility(true)}>Додати працівника</button>
        </div>}

        <Units unitId={data.unit._id} childUnits={data.unit.childUnits} employees={data.unit.employees} showAlert={showAlert}/>

        <Posts posts={data.unit.posts} pathname={props.location.pathname} createPost={createPost}
               deletePost={deletePost}/>

        {/* Forms */}
        {(employeeToUpdate || isCreateModalShown) && <React.Fragment>
          <Backdrop/>
          <Modal>
            {employeeToUpdate && <UpdateEmployeeForm employee={employeeToUpdate}
                                                     headPosition={head.position._id}
                                                     updateEmployee={updateEmployee}
                                                     closeModal={() => setEmployee(null)}/>}
            {/* todo: fetch junior positions from Form component */}
            {isCreateModalShown && <CreateEmployeeForm positions={head.position.juniorPositions}
                                                       createEmployee={createEmployee}
                                                       closeModal={setCreatModalVisibility}/>}
          </Modal>
        </React.Fragment>}
      </React.Fragment>}
    </React.Fragment>
  );
}

export default Unit;