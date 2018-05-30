import React, { Component } from "react";
import Spinner from "react-spinkit";
import User from "./User";

class UserList extends Component {
  renderUser(user, key, userProps) {
    const props = { ...user, ...userProps };
    const isLiked = Math.random() > 0.5 ? true : false;
    return (
      <li key={key}>
        <User {...props} />
      </li>
    );
  }

  render() {
    const { users, isLoadingData, likeUser, unlikeUser, token } = this.props;
    const userProps = { likeUser, unlikeUser, token };
    return (
      <div>
        {isLoadingData ? (
          <Spinner name="pacman" color="#ffff00" />
        ) : (
          <ul>
            {users.map((user, key) => this.renderUser(user, key, userProps))}
          </ul>
        )}
      </div>
    );
  }
}

export default UserList;
