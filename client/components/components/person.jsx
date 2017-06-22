import React from 'react';

const Person = (props) => (
  <div className={props.type}>{props.children}</div>
);

export default Person;
