import React from 'react';
import PropTypes from 'prop-types';
import Cell from '../Cell/Cell';
import ranks from '../../rank-mapping';

class Row extends React.Component {
  // check duty
  handleClick = () => {
    this.props.checkDay('111');
  };

  // set current user id
  handleMouseEnter = () => {
    this.props.setCurrentUserId(this.props.user.id);
  };

  render() {
    const cells = [...Array(30)]
      .map((x, i) => {
        const day = i + 1;
        const duties = this.props.user.duties.find(duty => duty.day === day);
        return <Cell key={day}
                     day={day}
                     duties={duties}
                     setCurrentDay={this.props.setCurrentDay}
                     togglePopover={this.props.togglePopover} />;
      });

    return (
      <tr onClick={this.handleClick} onMouseEnter={this.handleMouseEnter}>
        <td>{this.props.index}</td>
        <td className="align-left">{ranks[this.props.user.rank].short}</td>
        <td className="align-left">{this.props.user.name}</td>
        {cells}
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
  index: PropTypes.number,
  checkDay: PropTypes.func,
  setCurrentUserId: PropTypes.func,
  setCurrentDay: PropTypes.func,
  togglePopover: PropTypes.func
};

export default Row;
