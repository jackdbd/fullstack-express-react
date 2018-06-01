import React, { Component } from "react";
import Spinner from "react-spinkit";
import User from "./User";

const renderUser = (user, key, userProps) => {
  const props = { ...user, ...userProps };
  const isLiked = Math.random() > 0.5 ? true : false;
  return (
    <li key={key}>
      <User {...props} />
    </li>
  );
};

const UserList = props => {
  if (props.isLoadingData) {
    return <Spinner name="pacman" color="#ffff00" />;
  } else {
    const { users, likeUser, unlikeUser, token } = props;
    const userProps = { likeUser, unlikeUser, token };
    // const { users, userProps } = props;
    if (users) {
      return (
        <ul>{users.map((user, key) => renderUser(user, key, userProps))}</ul>
      );
    } else {
      return (
        <ul>
          <li>No users are using this app</li>
        </ul>
      );
    }
  }
};

export default UserList;
