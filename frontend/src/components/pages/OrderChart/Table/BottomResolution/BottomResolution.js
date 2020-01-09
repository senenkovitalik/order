import React from 'react';

export default function bottomResolution({head}) {
  return (
    <div className="row">
      <p>{head && head.position.name}</p>
      <div className="row_multicol">
        <span>{head && head.rank.name}</span>
        <span>{head && `${head.name} ${head.surname.toUpperCase()}`}</span>
      </div>
    </div>
  );
}
