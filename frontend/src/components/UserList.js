import React from "react";
import Spinner from "react-spinkit";
import User from "./User";

const renderUser = (user, key, userProps) => {
  const props = { ...user, ...userProps };
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
    const { users, currentUser, likeUser, unlikeUser, token } = props;
    const userProps = { currentUser, likeUser, unlikeUser, token };
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
