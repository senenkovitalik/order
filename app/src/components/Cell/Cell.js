import React from 'react';
import PropTypes from 'prop-types';
import './Cell.css';

const dutyMapping = {
  '111': {
    className: 'cell_used-full',
    content: ''
  },
  '110': {
    className: 'cell_used-partly',
    content: '1/2'
  },
  '100': {
    className: 'cell_used-partly',
    content: '1'
  },
  '101': {
    className: 'cell_used-partly',
    content: '1/3'
  },
  '011': {
    className: 'cell_used-partly',
    content: '2/3'
  },
  '001': {
    className: 'cell_used-partly',
    content: '3'
  },
  '010': {
    className: 'cell_used-partly',
    content: '2'
  },
};

function cell({ day, duties }) {
  const content = duties ? dutyMapping[duties.duty].content : null;
  const style = duties ? dutyMapping[duties.duty].className : null;
  return (
    <td data-day={day} className={style}>{content}</td>
  );
}

export default cell;

cell.propTypes = {
  day: PropTypes.number,  //todo: why we need this prop?
  duties: PropTypes.shape({
    day: PropTypes.number,
    duty: PropTypes.string
  }) || undefined
};