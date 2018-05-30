import React from "react";

// {renderIcon(isLiked)}

const Login = props => {
  const { loginUser } = props;
  const className = "btn waves-effect waves-light";

  // TODO: get them from the form
  const email = "email8021@gmail.com";
  const username = "user8021";
  const password = "pass8021";

  return (
    <div>
      <h1>Login</h1>
      <p>Login form here. Then a submit button will start the auth flow.</p>
      <button
        className={className}
        type="submit"
        name="action"
        onClick={() => {
          loginUser(email, username, password);
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
