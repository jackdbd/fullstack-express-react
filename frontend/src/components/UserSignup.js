import React, { Component } from "react";
import UserForm from "./UserForm";

class UserSignup extends Component {
  submit(values) {
    const { email, username, password } = values;
    this.props.signupUser(email, username, password);
  }
  render() {
    return (
      <div>
        <h1>Signup</h1>
        <UserForm onSubmit={this.submit.bind(this)} />
      </div>
    );
  }
}

export default UserSignup;
