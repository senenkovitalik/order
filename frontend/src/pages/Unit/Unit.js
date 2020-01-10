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
import { ADD_POST, CREATE_EMPLOYEE, CREATE_UNIT, DELETE_EMPLOYEE, DELETE_POST } from './queries';
import CreateUnitForm from './CreateUnitForm/CreateUnitForm';
import './Unit.css';

const UNIT = loader('./queries/UNIT.graphql');

function Unit(props) {
  const [isAlertShown, setAlertVisibility] = useState(false);
  const [isAlertSuccess, setSuccessAlertState] = useState(true);
  const [alertContent, setAlertContent] = useState('Something happens');
  const [employeeToUpdate, setEmployee] = useState(null);
  const [postName, setPostName] = useState('');
  const [isPostNameValid, setPostNameValidity] = useState(false);
  const [isCreateModalShown, setCreatModalVisibility] = useState(null);
  const [isChildUnitModalShown, setChildUnitModalVisibility] = useState(false);

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
  const [createUnitMutation] = useMutation(CREATE_UNIT);
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

  const createUnit = ({ name, shortName, head }) => createUnitMutation({
    variables: {
      parentUnit: data.unit._id,
      name,
      shortName,
      head
    },
    update: (cache, { data: { createUnit } }) => {
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
          unit: Object.assign({}, unit, { childUnits: unit.childUnits.concat(createUnit) })
        }
      });

      // code below this must be called in onCompleted handler
      // try to refactor at 3.1.0 release
      setChildUnitModalVisibility(false);
      showAlert(true, 'Підрозділ додано успішно.');
    },
    onError: error => {
      console.error(error);
      setChildUnitModalVisibility(false);
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

  const fallbackMessage = <div>Нічого не знайдено</div>;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner/>
      </div>
    );
  }

  const { name, head, employees, childUnits, posts } = data.unit;

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

        {/* Child Units */}
        {<div>
          <h2>Підрозділи</h2>
          {!!childUnits.length
            ? <React.Fragment>
              <ul>
                {childUnits.map(({ _id, name }) => <li key={_id}>
                  <Link to={`/unit/${_id}`}>{name}</Link>
                </li>)}
              </ul>
            </React.Fragment>
            : fallbackMessage}
          <button onClick={() => setChildUnitModalVisibility(true)}>Додати підрозділ</button>
        </div>}

        {/* Posts */}
        {<div>
          <h2>Бойові пости</h2>
          {!!posts.length
            ? <React.Fragment>
              <ul>
                {posts.map(({ _id, name }) => <li key={_id}>
                  <Link to={`${props.location.pathname}/posts/${_id}`}>{name}</Link>
                  <button onClick={() => deletePost(_id)}>Delete</button>
                </li>)}
              </ul>
            </React.Fragment>
            : fallbackMessage
          }

          <form>
            <label>
              Додати пост{' '}
              <input type='text' name='postName' onChange={handleChange} title={'Щось типу БП-000 чи 2БП-000'}/>
            </label>
            <button onClick={() => addPost()} disabled={!isPostNameValid}>ОК</button>
          </form>
        </div>}

        {/* Forms */}
        {(employeeToUpdate || isCreateModalShown || isChildUnitModalShown) && <React.Fragment>
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
            {isChildUnitModalShown && <CreateUnitForm heads={employees}
                                                      createUnit={createUnit}
                                                      hideModal={() => setChildUnitModalVisibility(false)}/>}
          </Modal>
        </React.Fragment>}
      </React.Fragment>}
    </React.Fragment>
  );
}

export default Unit;