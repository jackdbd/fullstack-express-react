import React, { Component } from "react";
import UserForm from "./UserForm";

class UserLogin extends Component {
  submit(values) {
    const { email, username, password } = values;
    this.props.loginUser(email, username, password);
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        <UserForm onSubmit={this.submit.bind(this)} />
      </div>
    );
  }
}

export default UserLogin;
