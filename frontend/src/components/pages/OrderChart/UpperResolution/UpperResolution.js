import React from 'react';

export default function upperResolution({head}) {
  const { position, rank, name, surname } = head;
  return (
    <div className="resolution">
      <div className="resolution__content row">
        <p>ЗАТВЕРДЖУЮ</p>
        <p>{position && position.name}</p>
        <div className="row_multicol">
          <span>{rank && rank.name}</span>
          <span>{name && surname && `${name.charAt(0)}.${surname.toUpperCase()}`}</span>
        </div>
        <p>"___" _____________ 2019 року</p>
      </div>
    </div>
  );
}
