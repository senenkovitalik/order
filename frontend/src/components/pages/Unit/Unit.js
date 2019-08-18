import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Unit extends React.Component {
  state = {
    unit: null
  };

  render() {
    const unitName = this.state.unit ? this.state.unit.name : '';
    const employees = this.state.unit ? this.state.unit.employees : [];
    return (
      <div className='unit' style={{padding: '2rem'}}>
        <h2>Особовий склад підрозділу: {unitName}</h2>
        <ul>
          {
            employees
              .sort((a, b) => b.rank.index - a.rank.index)
              .map(employee => <li key={employee._id}>
              {employee.rank.shortName} {employee.surname} {employee.name} {employee.patronymic}
            </li>)
          }
        </ul>
        <Link to={{
          pathname: `${this.props.location.pathname}/order_chart/`,
          state: {unit: this.state.unit}
        }}>Графік чергування</Link>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.match.params.id) {
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
              rank {
                name
              }
              position {
                name
              }
            }
            employees {
              _id
              rank {
                index
                shortName
              }
              name
              surname
              patronymic
            }
          }
        }`,
        variables: { id: this.props.match.params.id }
      };
      axios.get('/graphql', {
        baseURL: 'http://localhost:3001/',
        params: requestBody
      })
        .then(res => {
          const {unit} = res.data.data;
          this.setState({
            unit
          });
        })
        .catch(err => console.error(err));
    }
  }
}
