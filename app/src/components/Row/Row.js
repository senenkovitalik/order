import React from 'react';
import PropTypes from 'prop-types';
import Cell from '../Cell/Cell';
import ranks from '../../rank-mapping';

class Row extends React.Component {
  handleUserActions = e => {
    this.props.handleUserDutySelection(e, this.props.user.id, parseInt(e.nativeEvent.target.dataset.day, 10), '111');
  };

  render() {
    const cells = [...Array(30)]
      .map((x, i) => {
        const day = i + 1;
        const duties = this.props.user.duties.find(duty => duty.day === day);
        return <Cell key={day}
                     day={day}
                     duties={duties}/>;
      });

    return (
      <tr onClick={this.handleUserActions}
          onMouseOver={this.handleUserActions}
          onMouseLeave={this.handleUserActions}>
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
  togglePopover: PropTypes.func,
  handleUserDutySelection: PropTypes.func
};

export default Row;
