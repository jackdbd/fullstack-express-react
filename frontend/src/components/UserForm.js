import React, { Component } from "react";
import { Link } from "react-router-dom";
import { reduxForm, Field } from "redux-form";
import UserField from "./UserField";
import { isEmailValid } from "../utils/validators";

const FIELDS = [
  { name: "username", label: "Username" },
  { name: "email", label: "Email" },
  { name: "password", label: "Password" }
];

class UserForm extends Component {
  renderFields() {
    return FIELDS.map(f => {
      return (
        <Field
          key={f.name}
          component={UserField}
          type="text"
          label={f.label}
          name={f.name}
        />
      );
    });
  }

  render() {
    // handleSubmit comes from the reduxForm HOC
    const { handleSubmit } = this.props;
    return (
      <div>
        {/* <form onSubmit={handleSubmit(values => console.log(values))}> */}
        <form onSubmit={handleSubmit}>
          {this.renderFields()}
          <Link to="/" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.username) {
    errors.username = "You must provide a username";
  }
  if (!values.password) {
    errors.password = "You must provide a password";
  }
  if (!values.email) {
    errors.email = "You must provide an email";
  } else {
    if (!isEmailValid(values.email)) {
      errors.email = `${values.email} is not a valid email`;
    }
  }

  return errors;
}

const createReduxForm = reduxForm({
  validate,
  form: "userForm"
});

export default createReduxForm(UserForm);
