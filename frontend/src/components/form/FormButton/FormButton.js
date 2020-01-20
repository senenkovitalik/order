import React from 'react';

export default function FormButton({
                                     type = 'button', clickHandler = () => {
  }, isDisabled = false, children
                                   }) {
  return (
    <button type={type} onClick={clickHandler} disabled={isDisabled}>{children}</button>
  );
}