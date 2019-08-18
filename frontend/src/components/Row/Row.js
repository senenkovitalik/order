import React from 'react';
import PropTypes from 'prop-types';
import Cell from '../Cell/Cell';

class Row extends React.Component {
  // check duty
  handleClick = () => {
    this.props.checkDay('111');
  };

  // set current user id
  handleMouseEnter = () => {
    this.props.setCurrentUserId(this.props.employee.id);
  };

  render() {
    const cells = [...Array(30)]
      .map((x, i) => {
        const day = i + 1;
        const duties = undefined; /*this.props.employee.duties.find(duty => duty.day === day);*/
        return <Cell key={day}
                     day={day}
                     duties={duties}
                     setCurrentDay={this.props.setCurrentDay}
                     togglePopover={this.props.togglePopover} />;
      });

    const {name, surname, patronymic} = this.props.employee;
    const empName = `${surname} ${name.charAt(0).toUpperCase()}.${patronymic.charAt(0).toUpperCase()}.`;
    return (
      <tr onClick={this.handleClick} onMouseEnter={this.handleMouseEnter}>
        <td>{this.props.index}</td>
        <td className="align-left">{this.props.employee.rank.shortName}</td>
        <td className="align-left">{empName}</td>
        {cells}
      </tr>
    );
  }
}

Row.propTypes = {
  employee: PropTypes.shape({
    _id: PropTypes.string,
    rank: PropTypes.shape({
      index: PropTypes.number,
      shortName: PropTypes.string
    }),
    index: PropTypes.number,
    shortName: PropTypes.string,
    name: PropTypes.string,
    surname: PropTypes.string,
    patronymic: PropTypes.string
  }),
  index: PropTypes.number,
  checkDay: PropTypes.func,
  setCurrentUserId: PropTypes.func,
  setCurrentDay: PropTypes.func,
  togglePopover: PropTypes.func
};

export default Row;
