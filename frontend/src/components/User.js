import React from "react";
import Like from "./Like";

const User = props => {
  const { username, numLikes, isLiked } = props;
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>{username}</h1>
        </div>
        <div className="card-action grey lighten-4">
          <Like numLikes={numLikes} isLiked={isLiked} />
        </div>
      </div>
    </div>
  );
};

export default User;
