import React from 'react';
import axios from 'axios';

export default class Employee extends React.Component {
  state = {
    employee: null
  };

  render() {
    const employee = this.state.employee;
    if (!employee) return null;

    return (
      <div style={{ padding: '2rem' }}>
        <h1>{employee.surname} {employee.name} {employee.patronymic}</h1>
        <p>Військове звання: {employee.rank.name}</p>
        <p>Посада: {employee.position.name}</p>
        <p>День народження: {new Date(parseInt(employee.dateOfBirth)).toLocaleDateString()}</p>
        {employee.addressOfResidence &&
          <React.Fragment>
            <p>Адреса проживання:</p>
            <ul>
              {employee.addressOfResidence.region && <li>{employee.addressOfResidence.region} область</li>}
              {employee.addressOfResidence.city && <li>Місто {employee.addressOfResidence.city}</li>}
              {employee.addressOfResidence.district && <li>{employee.addressOfResidence.district} район</li>}
              {employee.addressOfResidence.urbanVillage && <li>Село міського типу {employee.addressOfResidence.urbanVillage}</li>}
              {employee.addressOfResidence.village && <li>Село {employee.addressOfResidence.village}</li>}
              {employee.addressOfResidence.street && <li>Вулиця {employee.addressOfResidence.street}</li>}
              {employee.addressOfResidence.houseNumber && <li>Будинок №{employee.addressOfResidence.houseNumber}</li>}
              {employee.addressOfResidence.apartmentNumber && <li>Квартира №{employee.addressOfResidence.apartmentNumber}</li>}
            </ul>
          </React.Fragment>
        }
        {employee.registrationAddress &&
        <React.Fragment>
          <p>Адреса рєєстрації:</p>
          <ul>
            {employee.registrationAddress.region && <li>{employee.registrationAddress.region} область</li>}
            {employee.registrationAddress.city && <li>Місто {employee.registrationAddress.city}</li>}
            {employee.registrationAddress.district && <li>{employee.registrationAddress.district} район</li>}
            {employee.registrationAddress.urbanVillage && <li>Село міського типу {employee.registrationAddress.urbanVillage}</li>}
            {employee.registrationAddress.village && <li>Село {employee.registrationAddress.village}</li>}
            {employee.registrationAddress.street && <li>Вулиця {employee.registrationAddress.street}</li>}
            {employee.registrationAddress.houseNumber && <li>Будинок №{employee.registrationAddress.houseNumber}</li>}
            {employee.registrationAddress.apartmentNumber && <li>Квартира №{employee.registrationAddress.apartmentNumber}</li>}
          </ul>
        </React.Fragment>
        }
      </div>
    );
  }

  componentDidMount() {
    const requestBody = {
      query: `query Employee($id: String!) {
          employee(id: $id) {
            _id
            rank {
              name
            }
            position {
              name
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
      variables: { id: this.props.match.params.id }
    };
    axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody,
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
      .then(res => {
        this.setState({ employee: res.data.data.employee });
      })
      .catch(err => console.error(err));
  }
}
