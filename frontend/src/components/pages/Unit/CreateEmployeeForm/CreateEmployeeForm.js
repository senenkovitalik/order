import React from 'react';
import convertDate from '../../../../utils';
import { addressData } from '../../../data';
import axios from 'axios';

import './CreateEmployeeForm.css';

export default class CreateEmployeeForm extends React.Component {
  state = {
    ranks: [],
    employee: {
      surname: '',
      name: '',
      patronymic: '',
      position: this.props.positions[0]._id,
      rank: '',
      dateOfBirth: '',
    },
    addressOfResidence: {
      region: '',
      city: '',
      district: '',
      urbanVillage: '',
      village: '',
      street: '',
      houseNumber: '',
      apartmentNumber: ''
    },
    registrationAddress: {
      region: '',
      city: '',
      district: '',
      urbanVillage: '',
      village: '',
      street: '',
      houseNumber: '',
      apartmentNumber: ''
    }
  };

  handleChange = e => {
    e.preventDefault();
    const { name } = e.target;
    const parts = name.split('.');

    let value;
    if (name === 'dateOfBirth') {
      const parts = e.target.value.split('-');
      value = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
    } else {
      value = e.target.value;
    }

    let newState;
    if (parts.length === 2) {
      const stateField = parts[0];
      const fieldName = parts[1];

      if (!['addressOfResidence', 'registrationAddress'].includes(stateField)) {
        return;
      }

      const srcOne = Object.assign(
        {},
        this.state[stateField],
        { [fieldName]: value });
      newState = Object.assign({}, { [stateField]: srcOne });
    } else {
      const srcOne = Object.assign({}, this.state.employee, { [name]: value });
      newState = { employee: srcOne };
    }

    this.setState(newState);
  };

  createEmployee = e => {
    e.preventDefault();
    const { ranks, ...rest } = this.state;
    this.props.createEmployee(rest);
  };

  copyAddressFromRegistration = e => {
    e.preventDefault();
    const address = Object.assign({}, this.state.registrationAddress);
    this.setState({
      addressOfResidence: address
    });
  };

  copyAddressFromResidence = e => {
    e.preventDefault();
    const address = Object.assign({}, this.state.addressOfResidence);
    this.setState({
      registrationAddress: address
    });
  };

  render() {
    return (
      <form className='employee-form'>
        <h3>Додати працівника</h3>
        {/* Surname */}
        <label>
          <span>Прізвище <span className='require'>{}</span></span>
          <input type='text' name='surname' value={this.state.employee.surname} onChange={this.handleChange}/>
        </label>

        {/* Name */}
        <label>
          <span>Ім`я <span className='require'>{}</span></span>
          <input type='text' name='name' value={this.state.employee.name} onChange={this.handleChange}/>
        </label>

        {/* Patronymic */}
        <label>
          <span>Побатькові <span className='require'>{}</span></span>
          <input type='text' name='patronymic' value={this.state.employee.patronymic} onChange={this.handleChange}/>
        </label>

        {/* Rank */}
        <label>
          <span>Військове звання</span>
          <select value={this.state.employee.rank} name='rank' onChange={this.handleChange}>
            {
              this.state.ranks
                .sort((a, b) => a.index - b.index)
                .map(rank =>
                  <option key={rank._id} value={rank._id}>{rank.name}</option>)
            }
          </select>
        </label>

        {/* Position */}
        <label>
          <span>Посада</span>
          <select name='position' value={this.state.employee.position} onChange={this.handleChange}>
            {
              this.props.positions
                .map(position =>
                  <option key={position._id} value={position._id}>{position.name}</option>)
            }
          </select>
        </label>

        {/* Date of Birth */}
        <label>
          <span>День народження <span className='require'>{}</span></span>
          <input type="date" name="dateOfBirth"
                 value={convertDate(this.state.employee.dateOfBirth)}
                 onChange={this.handleChange}/>
        </label>

        <hr />

        <span>Адреса проживання <span className='require'>{}</span></span>
        <button onClick={this.copyAddressFromRegistration}>Copy from registration</button>
        {addressData.map((item, i) => (
          <label key={i}>
            <span>{item.title}</span>
            <input type='text' name={`addressOfResidence.${item.field}`}
                   value={this.state.addressOfResidence[item.field]}
                   onChange={this.handleChange}/>
          </label>)
        )}

        <hr />

        <span>Адреса рєєстрації <span className='require'>{}</span></span>
        <button onClick={this.copyAddressFromResidence}>Copy from residence</button>
        {addressData.map((item, i) => (
          <label key={i}>
            <span>{item.title}</span>
            <input type='text' name={`registrationAddress.${item.field}`}
                   value={this.state.registrationAddress[item.field]}
                   onChange={this.handleChange}/>
          </label>)
        )}

        <button onClick={this.createEmployee}>Create</button>
        <button onClick={() => this.props.closeModal(false)}>Cancel</button>
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
        const employee = Object.assign({}, this.state.employee);
        employee.rank = ranks[0]._id;
        this.setState({ ranks, employee });
      })
      .catch(err => {
        console.error(err);
      });
  }
}
