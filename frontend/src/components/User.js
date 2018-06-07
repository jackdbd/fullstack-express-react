import React from "react";
import Like from "./Like";

const User = props => {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>{props.username}</h1>
          <p>Likes: {props.numLikes}</p>
        </div>
        <div className="card-action grey lighten-4">
          <Like {...props} />
        </div>
      </div>
    </div>
  );
};

export default User;
