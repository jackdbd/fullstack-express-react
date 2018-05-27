import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch, Link } from "react-router-dom";
import Header from "./Header";
import User from "./User";
import Login from "./Login";
import UserList from "../containers/UserList";

class App extends Component {
  isUserLoggedIn() {
    return true;
  }
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" render={props => <UserList />} />
              <Route
                exact
                path="/me"
                render={props =>
                  this.isUserLoggedIn() ? (
                    <User username={"test-username"} numLikes={123} />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/login"
                render={props => <Login {...props} />}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
