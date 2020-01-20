import React from 'react';

export default function FormInput({ fieldName, type, name, value, title = '', handler }) {
  return (
    <label>
      <span className='form-field'>{fieldName}</span>
      <input type={type} name={name} value={value} onChange={handler} title={title}/>
    </label>
  );
}