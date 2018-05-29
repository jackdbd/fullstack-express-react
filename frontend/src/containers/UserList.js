import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Spinner from "react-spinkit";
import { fetchUsers, likeUser } from "../actions";
import User from "../components/User";

class UserList extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  renderUser(user, key) {
    const isLiked = Math.random() > 0.5 ? true : false;
    return (
      <li key={key}>
        <User {...user} isLiked={isLiked} likeUser={this.props.likeUser} />
      </li>
    );
  }

  render() {
    return (
      <div>
        {this.props.isLoadingData ? (
          <Spinner name="pacman" color="#ffff00" />
        ) : (
          <ul>
            {this.props.users.map((user, key) => this.renderUser(user, key))}
          </ul>
        )}
      </div>
    );
  }
}

/*
  Take a portion of the entire application state (managed by redux) and make it
  available to this container component via props.
*/
function mapStateToProps(state) {
  const { users, isLoadingData } = state.apiStore;
  const props = {
    users,
    isLoadingData
  };
  return props;
}

/* 
  Bind action creators to props and pass them to all reducers via the dispatch
  function. Anything returned from this function will end up as props on the
  UserList container.
*/
function mapDispatchToProps(dispatch) {
  // object destructuring: {fetchUsers (prop): fetchUsers (action creator)}
  return bindActionCreators({ fetchUsers, likeUser }, dispatch);
}

/*
  Promote the "dumb", redux-unaware, presentational component, to a "smart",
  redux-aware, container component.
*/
export default connect(mapStateToProps, mapDispatchToProps)(UserList);
