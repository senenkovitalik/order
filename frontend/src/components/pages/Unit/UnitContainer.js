import React, { useState } from 'react';
import Posts from '../Posts/Posts';
import Unit from './Unit';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Spinner from '../../Spiner/Spinner';
import Alert from '../../Alert/Alert';
import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import UpdateEmployeeForm from '../../forms/UpdateEmployeeForm/UpdateEmployeeForm';
import CreateEmployeeForm from '../../forms/CreateEmployeeForm/CreateEmployeeForm';

const UNIT = gql`
  query Unit($id: ID!) {
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
  }`;

const CREATE_EMPLOYEE = gql`
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
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      _id
    }
  }
`;

function UnitContainer(props) {
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
      console.error(error);
      setAlertVisibility(true);
      setSuccessAlertState(false);
    }
  });
  const [createEmployeeMutation] = useMutation(CREATE_EMPLOYEE);
  const [deleteEmployeeMutation] = useMutation(DELETE_EMPLOYEE);

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
            unit: Object.assign({}, unit, {employees: unit.employees.concat(createEmployee)})
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
            {employees: unit.employees.filter(({_id}) => _id !== deleteEmployee._id)})
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
  const addPost = postName => {
    const { _id: unitId } = this.state.unit;
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
          unit: Object.assign({}, prevState.unit, { posts: [...prevState.unit.posts, post] }),
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

  const deletePost = postId => {
    const requestBody = {
      query: `
          mutation DeletePost($id: ID!) {
            deletePost(id: $id) {
              _id
            }
          }
        `,
      variables: {
        id: postId
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
        const { _id } = res.data.data.deletePost;
        const postsUpdated = this.state.unit.posts.filter(post => post._id !== _id);
        this.setState(prevState => ({
          unit: Object.assign({}, prevState.unit, { posts: postsUpdated }),
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
          alertContent: 'Щось трапилося. Зверніться до адміністратора.'
        });
      });
  };

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
          <Unit unit={data.unit}
                setEmployeeToUpdate={id => setEmployee(data.unit.employees.find(e => e._id === id))}
                showCreateEmployeeModal={setCreatModalVisibility}
                updateEmployee={updateEmployee}
                deleteEmployee={deleteEmployee}/>
          <Posts posts={data.unit.posts}
                 addPost={addPost}
                 deletePost={deletePost}/>
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