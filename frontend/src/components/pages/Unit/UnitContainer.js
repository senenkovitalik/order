import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Spinner from '../../Spiner/Spinner';
import Alert from '../../Alert/Alert';
import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import UpdateEmployeeForm from '../../forms/UpdateEmployeeForm/UpdateEmployeeForm';
import CreateEmployeeForm from '../../forms/CreateEmployeeForm/CreateEmployeeForm';
import { ADD_POST, CREATE_EMPLOYEE, DELETE_EMPLOYEE, DELETE_POST, UNIT } from './queries';

function UnitContainer(props) {
  const [isAlertShown, setAlertVisibility] = useState(false);
  const [isAlertSuccess, setSuccessAlertState] = useState(true);
  const [alertContent, setAlertContent] = useState('Something happens');
  const [employeeToUpdate, setEmployee] = useState(null);
  const [postName, setPostName] = useState('');
  const [isPostNameValid, setPostNameValidity] = useState(false);
  const [isCreateModalShown, setCreatModalVisibility] = useState(null);

  const { loading, data } = useQuery(UNIT, {
    variables: {
      id: props.match.params.unitId
    },
    onError: error => {
      console.error(error);
      setAlertVisibility(true);
      setSuccessAlertState(false);
    }
  });
  const [createEmployeeMutation] = useMutation(CREATE_EMPLOYEE);
  const [deleteEmployeeMutation] = useMutation(DELETE_EMPLOYEE);
  const [addPostMutation] = useMutation(ADD_POST);
  const [deletePostMutation] = useMutation(DELETE_POST);

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
  const handleChange = e => {
    const { name, value } = e.target;
    setPostName(name);
    setPostNameValidity(value.length > 3);
  };

  const addPost = () => addPostMutation({
    variables: {
      unitId: data.unit._id,
      postName
    },
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

      // code below this must be called in onCompleted handler
      // try to refactor at 3.1.0 release
      setCreatModalVisibility(false);
      showAlert(true, 'Пост додано успішно.');
    },
    onError: error => {
      console.error(error);
      setCreatModalVisibility(false);
      showAlert(false);
    }
  });

  const deletePost = postId => deletePostMutation({
    variables: {
      id: postId
    },
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

      // code below this must be called in onCompleted handler
      // try to refactor at 3.1.0 release
      showAlert(true, 'Пост видалено успішно.');
    },
    onError: error => {
      console.error(error);
      showAlert(false);
    }
  });

  // alerts
  const showAlert = (success, content = 'Something happens') => {
    setAlertVisibility(true);
    setSuccessAlertState(success);
    setAlertContent(content);
  };

  const closeAlert = () => setAlertVisibility(false);

  return (
    <React.Fragment>
      {
        isAlertShown &&
        <div style={{ paddingTop: '1rem' }}>
          <Alert success={isAlertSuccess}
                 dismiss={closeAlert}>
            {alertContent}
          </Alert>
        </div>
      }
      {
        loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner/>
        </div>
      }
      {
        data && data.unit && <React.Fragment>
          <h1>{data.unit.name}</h1>

          {/* Employees */}
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
              data.unit.employees.sort((a, b) => b.rank.index - a.rank.index)
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

          <button onClick={() => setCreatModalVisibility(true)}>Add Employee</button>

          {/* Posts */}
          <h2>Бойові пости</h2>
          <ul>
            {data.unit.posts.map(({ _id, name }) => <li key={_id}>
              <Link to={`${props.location.pathname}/posts/${_id}`}>{name}</Link>
              <button onClick={() => deletePost(_id)}>Delete</button>
            </li>)}
          </ul>

          <form>
            <label>
              New post{' '}
              <input type='text'
                     name='postName'
                     onChange={handleChange}
                     title={'Щось типу БП-000 чи 2БП-000'}/>
            </label>
            <button onClick={() => addPost()} disabled={!isPostNameValid}>Add post</button>
          </form>

          {/* Forms */}
          {
            (employeeToUpdate || isCreateModalShown) &&
            <React.Fragment>
              <Backdrop/>
              <Modal>
                {employeeToUpdate &&
                <UpdateEmployeeForm employee={employeeToUpdate}
                                    positions={data.unit.head.position.juniorPositions}
                                    updateEmployee={updateEmployee}
                                    closeModal={() => setEmployee(null)}/>
                }
                {isCreateModalShown &&
                <CreateEmployeeForm positions={data.unit.head.position.juniorPositions}
                                    createEmployee={createEmployee}
                                    closeModal={setCreatModalVisibility}/>
                }
              </Modal>
            </React.Fragment>
          }
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default withRouter(UnitContainer);