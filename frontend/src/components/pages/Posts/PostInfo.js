import React from 'react';
import { Link } from 'react-router-dom';
import { monthes } from '../../data';
import Spinner from '../../Spiner/Spinner';

class PostInfo extends React.Component {
  state = {
    monthDuties: [],
    loading: false
  };

  handleSubmit = e => {
    e.preventDefault();
    const [year, month] = this.dateRef.value.split('-');
    this.props.history.push(`${this.props.location.pathname}/orderChart?year=${year}&month=${month}`);
  };

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Графіки чергування на {new Date().getFullYear()}</h2>
        {
          this.state.loading &&
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spinner/>
          </div>
        }
        <div>
          {
            !!this.state.monthDuties.length &&
            <ul>
              {this.state.monthDuties.map(({ _id, year, month }) =>
                <li key={_id}>
                  <Link to={`${this.props.location.pathname}/orderChart?year=${year}&month=${month}`}>
                    Графік чергування - {monthes[month - 1].name}, {year}
                  </Link>
                </li>)
              }
            </ul>
          }
          {
            !this.state.monthDuties.length && !this.state.loading && 'Нічого не знайдено :('
          }
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>Заповнити графік чергування на{' '}<input type='month'
                                                           ref={(element) => this.dateRef = element}/></label>
          <input type='submit' value={'Заповнити'}/>
        </form>
      </div>
    );
  }

  // fetch month duties
  componentDidMount() {
    this.setState({
      monthDuties: [],
      loading: false
    });
  }
}

export default PostInfo;