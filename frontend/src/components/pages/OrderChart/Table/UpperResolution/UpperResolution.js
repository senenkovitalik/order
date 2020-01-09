import React from 'react';

export default function upperResolution({head: {position, rank, name, surname}}) {
  return (
    <div className="resolution">
      <div className="resolution__content row">
        <p>ЗАТВЕРДЖУЮ</p>
        <p>{position.name}</p>
        <div className="row_multicol">
          <span>{rank.name}</span>
          <span>{`${name} ${surname.toUpperCase()}`}</span>
        </div>
        <p>"___" _____________ 2019 року</p>
      </div>
    </div>
  );
}
