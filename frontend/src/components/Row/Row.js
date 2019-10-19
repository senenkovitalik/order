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
    this.props.setCurrentEmployeeId(this.props.employee._id);
  };

  render() {
    const cells = [...Array(this.props.days)]
      .map((x, i) => {
        const day = i + 1;
        const duty = this.props.employee.duties.find(duty => duty.day === day);
        return <Cell key={day}
                     day={day}
                     duty={duty}
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
  }).isRequired,
  index: PropTypes.number.isRequired,
  checkDay: PropTypes.func.isRequired,
  setCurrentEmployeeId: PropTypes.func.isRequired,
  setCurrentDay: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired
};

export default Row;
