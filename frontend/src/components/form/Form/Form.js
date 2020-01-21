import React from 'react';
import FormInput from '../FormInput/FormInput';
import FormButton from '../FormButton/FormButton';

export default function Form({ configObject, submitHandler, header, error }) {
  return (
    <form onSubmit={submitHandler}>
      <h3>{header}</h3>

      {error && <span style={{ color: 'red' }}>Щось трапилося. Спробуйте ще раз.</span>}

      {configObject.fields.map(({type, name, label, value, handler}, i) =>
        <FormInput key={i} type={type} name={name} fieldName={label}
                   value={value}
                   handler={handler}/>)}

      {configObject.buttons.map(({ type, isDisabled, title, clickHandler }, i) =>
        <FormButton key={i} type={type} isDisabled={isDisabled} clickHandler={clickHandler}>{title}</FormButton>)}
    </form>
  );
}