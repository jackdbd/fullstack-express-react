import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import {
  fetchUsers,
  likeUser,
  unlikeUser,
  loginUser,
  logoutUser
} from "../actions";
import Header from "../components/Header";
import User from "../components/User";
import Login from "../components/Login";
import UserList from "../components/UserList";

export class App extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const {
      users,
      isLoadingData,
      likeUser,
      unlikeUser,
      loginUser,
      logoutUser,
      token,
      currentUser
    } = this.props;
    const headerProps = { token, logoutUser };
    const loginProps = { loginUser };
    const userListProps = { users, isLoadingData, likeUser, unlikeUser, token };

    return (
      <div className="container">
        <BrowserRouter>
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
                path="/me"
                render={props =>
                  this.props.token ? (
                    <User {...currentUser} />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/login"
                render={() => <Login {...loginProps} />}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
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
    { fetchUsers, likeUser, unlikeUser, loginUser, logoutUser },
    dispatch
  );
}

/*
  Promote the "dumb", redux-unaware, presentational component, to a "smart",
  redux-aware, container component.
*/
export default connect(mapStateToProps, mapDispatchToProps)(App);
