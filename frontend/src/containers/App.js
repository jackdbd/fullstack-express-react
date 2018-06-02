import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import {
  fetchUsers,
  likeUser,
  unlikeUser,
  signupUser,
  loginUser,
  logoutUser
} from "../actions";
import Header from "../components/Header";
import User from "../components/User";
import UserList from "../components/UserList";
import UserSignup from "../components/UserSignup";
import UserLogin from "../components/UserLogin";

const NoMatch = props => {
  return (
    <div>
      <h3>
        No match for <strong>{props.location.pathname}</strong> (404)
      </h3>
    </div>
  );
};

class App extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const headerProps = {
      token: this.props.token,
      logoutUser: this.props.logoutUser
    };
    const authProps = {
      token: this.props.token,
      likeUser: this.props.likeUser,
      unlikeUser: this.props.unlikeUser
    };
    const userListProps = {
      ...authProps,
      users: this.props.users,
      isLoadingData: this.props.isLoadingData
    };
    const { id, username, numLikes } = this.props.currentUser;

    return (
      <BrowserRouter>
        <div className="container">
          <div>
            <Header {...headerProps} />
            <Switch>
              <Route
                exact
                path="/"
                render={() => <UserList {...userListProps} />}
              />
              <Route
                exact
                path="/signup"
                render={() =>
                  !this.props.token ? (
                    <UserSignup signupUser={this.props.signupUser} />
                  ) : (
                    <Redirect to="/me" />
                  )
                }
              />
              <Route
                exact
                path="/login"
                render={() =>
                  !this.props.token ? (
                    <UserLogin loginUser={this.props.loginUser} />
                  ) : (
                    <Redirect to="/me" />
                  )
                }
              />
              <Route
                exact
                path="/most-liked"
                render={() => <UserList {...userListProps} />}
              />
              <Route
                exact
                path="/me"
                render={props =>
                  this.props.token ? (
                    <User
                      {...authProps}
                      id={id}
                      username={username}
                      numLikes={numLikes}
                    />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              {/* Catch all URLs that didn't match any route */}
              <Route render={props => <NoMatch {...props} />} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

/*
  Take a portion of the entire application state (managed by redux) and make it
  available to this container component via props.
*/
function mapStateToProps(state) {
  const { users, isLoadingData, token, currentUser } = state.apiStore;
  const props = {
    users,
    isLoadingData,
    token,
    currentUser
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
  return bindActionCreators(
    { fetchUsers, likeUser, unlikeUser, signupUser, loginUser, logoutUser },
    dispatch
  );
}

/*
  Promote the "dumb", redux-unaware, presentational component, to a "smart",
  redux-aware, container component.
*/
const AppWithRedux = connect(mapStateToProps, mapDispatchToProps)(App);

export { App, AppWithRedux };
