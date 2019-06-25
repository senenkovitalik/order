import React from 'react';
import PropTypes from 'prop-types';
import Cell from '../Cell/Cell';

class Row extends React.Component {

  handleClick = e => {
    e.preventDefault();
    const { day } = e.nativeEvent.target.dataset;
    this.props.checkDay(this.props.user.id, parseInt(day, 10));
  };

  render() {
    return (
      <tr onClick={e => this.handleClick(e)}>
        <td>{this.props.index}</td>
        <td className="align-left">{this.props.user.rank}</td>
        <td className="align-left">{this.props.user.name}</td>
        {
          [...Array(30)].map((x, i) => {
            const day = i + 1;
            const isUsed = !!this.props.user.days.find(e => e === day);
            return <Cell key={day}
                         day={day}
                         isUsed={isUsed}/>;
          })
        }
      </tr>
    );
  }
}

export default Row;

Row.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    rank: PropTypes.string,
    days: PropTypes.arrayOf(PropTypes.number)
  }),
  index: PropTypes.number,
  checkDay: PropTypes.func
};