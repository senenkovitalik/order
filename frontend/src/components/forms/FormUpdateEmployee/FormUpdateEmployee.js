import React from 'react';
import convertDate from '../../../utils';
import axios from 'axios';

export default class FormUpdateEmployee extends React.Component {
  state = {
    ranks: [],
    addressOfResidence: {},
    registrationAddress: {}
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    const parts = name.split('.');
    const stateField = parts[0];
    const fieldName = parts[1];
    const newState = {

    };
    this.setState({
      [stateField]: fieldName
    });

    console.log(stateField, fieldName);
  };

  render() {
    if (!this.props.employee) {
      return null;
    }
    const addressData = [
      { field: 'region', title: 'Область' },
      { field: 'city', title: 'Місто' },
      { field: 'district', title: 'Район' },
      { field: 'urbanVillage', title: 'Селище міського типу' },
      { field: 'village', title: 'Село' },
      { field: 'street', title: 'Вулиця' },
      { field: 'houseNumber', title: 'Будинок №' },
      { field: 'apartmentNumber', title: 'Квартира №' }
    ];
    return (
      <form className='employee-update-form'>
        <h3>Оновити дані про
          працівника: {this.props.employee.surname} {this.props.employee.name} {this.props.employee.patronymic}</h3>
        <label>
          <span>Прізвище</span>
          <input type='text' name='surname' defaultValue={this.props.employee.surname}/>
        </label>

        <label>
          <span>Ім`я</span>
          <input type='text' name='name' defaultValue={this.props.employee.name}/>
        </label>

        <label>
          <span>Побатькові</span>
          <input type='text' name='patronymic' defaultValue={this.props.employee.patronymic}/>
        </label>

        <label>
          <span>Військове звання</span>
          <select defaultValue={this.props.employee.rank._id} name='rank'>
            {
              this.state.ranks
                .sort((a, b) => a.index - b.index)
                .map(rank =>
                  <option key={rank._id} value={rank._id}>{rank.name}</option>)
            }
          </select>
        </label>

        <label>
          <span>Посада</span>
          <select defaultValue={this.props.employee.position._id} name='position'>
            {
              this.props.positions
                .map(position =>
                  <option key={position._id} value={position._id}>{position.name}</option>)
            }
          </select>
        </label>

        <label>
          <span>День народження</span>
          <input type="date" name="dateOfBirth"
                 defaultValue={convertDate(this.props.employee.dateOfBirth)}/>
        </label>

        <span>Адреса проживання</span>

        {addressData.map((item, i) => {
          const value = this.props.employee.addressOfResidence
            ? this.props.employee.addressOfResidence[item.field]
            : null;
          return <label key={i}>
            <span>{item.title}</span>
            <input type='text' name={`addressOfResidence.${item.field}`} defaultValue={value}
                   onChange={this.handleChange}/>
          </label>;
        })}

        <span>Адреса рєєстрації</span>

        {addressData.map((item, i) => {
          const value = this.props.employee.registrationAddress
            ? this.props.employee.registrationAddress[item.field]
            : null;
          return <label key={i}>
            <span>{item.title}</span>
            <input type='text' name={`registrationAddress.${item.field}`} defaultValue={value}/>
          </label>;
        })}

        <button>Update</button>
        <button onClick={this.props.closeModal}>Cancel</button>
      </form>
    );
  }

  componentDidMount() {
    const requestBody = {
      query: `
        query Ranks {
          ranks {
            _id
            index
            name
          }
        }`
    };
    axios.get('/graphql', {
      baseURL: 'http://localhost:3001/',
      params: requestBody,
    })
      .then(res => {
        const { ranks } = res.data.data;
        this.setState({ ranks });
      })
      .catch(err => {
        console.error(err);
      });
  }
}