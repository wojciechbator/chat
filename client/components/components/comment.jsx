import React from 'react';

const Comment = (props) => (
  <div className={props.type}>
    <span className="author">{props.author}</span>
    <span className="separator"></span>
    {props.children}
  </div>
);

export default Comment;
