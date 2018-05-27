import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchUsers } from "../actions";
import User from "../components/User";

class UserList extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  renderUser(user) {
    const { username, numLikes } = user;
    return (
      <li key={username}>
        <User username={username} numLikes={numLikes} />
      </li>
    );
  }

  render() {
    return (
      <div>
        <ul>{this.props.users.map(user => this.renderUser(user))}</ul>
      </div>
    );
  }
}

/*
  Take a portion of the entire application state (managed by redux) and make it
  available to this container component via props.
*/
function mapStateToProps(state) {
  const props = {
    users: state.apiStore.users
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
  return bindActionCreators({ fetchUsers }, dispatch);
}

/*
  Promote the "dumb", redux-unaware, presentational component, to a "smart",
  redux-aware, container component.
*/
export default connect(mapStateToProps, mapDispatchToProps)(UserList);
