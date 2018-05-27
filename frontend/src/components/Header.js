import React from "react";

const Header = props => {
  return (
    <nav>
      <div className="nav-wrapper">
        <a href="index.html" className="brand-logo">
          Logo
        </a>
        <ul className="right">
          <li>
            <a href="TODO_USER_ID.html">Me</a>
          </li>
          <li>
            <a href="TODO_API_LOGIN.html">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
