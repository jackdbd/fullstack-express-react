import React from "react";

const User = props => {
  const { username, numLikes } = props;
  return (
    <div>
      <h1>{username}</h1>
      <p>{numLikes}</p>
    </div>
  );
};

export default User;
