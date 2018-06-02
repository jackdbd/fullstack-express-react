import React from "react";
import styled from "styled-components";

// Override the colors of the Materialize CSS .btn class
const Button = styled.button`
  background: ${props => (props.isLiked ? "#d50000" : "#f5f5f5")} !important;
  color: ${props => (props.isLiked ? "#f5f5f5" : "#d50000")} !important;
`;

const renderIcon = toggle => {
  if (toggle) {
    return <i className="material-icons right">favorite</i>;
  } else {
    return <i className="material-icons right">favorite_border</i>;
  }
};

const Like = props => {
  const { numLikes, isLiked, likeUser, unlikeUser, id, token } = props;
  const className = "btn waves-effect waves-light";
  return (
    <div>
      <Button
        isLiked={true}
        className={className}
        type="submit"
        name="action"
        onClick={() => likeUser(id, token)}
      >
        Likes: {numLikes}
        {renderIcon(isLiked)}
      </Button>
      <Button type="submit" name="action" onClick={() => unlikeUser(id, token)}>
        Unlike
      </Button>
    </div>
  );
};

export default Like;
