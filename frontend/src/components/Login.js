import React from "react";

// {renderIcon(isLiked)}

const Login = props => {
  const { loginUser } = props;
  const className = "btn waves-effect waves-light";

  // TODO: get them from the form
  const email = "giacomo1984@gmail.com";
  const username = "giacomo1984";
  const password = "bankai1984";

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
