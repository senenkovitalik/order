import React from 'react';
import PropTypes from 'prop-types';
import Cell from '../Cell/Cell';
import ranks from '../../rank-mapping';

class Row extends React.Component {

  handleClick = e => {
    e.preventDefault();
    const { day } = e.nativeEvent.target.dataset;
    if (this.props.isFullDuty) {
      this.props.checkDay(this.props.user.id, parseInt(day, 10), '111');
    } else {
    }
  };

  render() {
    return (
      <tr onClick={e => this.handleClick(e)}>
        <td>{this.props.index}</td>
        <td className="align-left">{ranks[this.props.user.rank].short}</td>
        <td className="align-left">{this.props.user.name}</td>
        {
          [...Array(30)].map((x, i) => {
            const day = i + 1;
            const duties = this.props.user.duties.find(duty => duty.day === day);
            return <Cell key={day}
                         day={day}
                         duties={duties}/>;
          })
        }
      </tr>
    );
  }
}

Row.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    rank: PropTypes.number,
    duties: PropTypes.arrayOf(PropTypes.object)
  }),
  isFullDuty: PropTypes.bool,
  index: PropTypes.number,
  checkDay: PropTypes.func
};

export default Row;
