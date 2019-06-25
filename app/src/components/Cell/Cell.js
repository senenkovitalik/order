import React from 'react';
import PropTypes from 'prop-types';

function cell({ day, isUsed }) {
  return (
    <td data-day={day} className={isUsed ? 'used' : null}>{}</td>
  );
}

export default cell;

cell.propTypes = {
  day: PropTypes.number,
  isUsed: PropTypes.bool
};