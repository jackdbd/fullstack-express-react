import React from "react";
import { Link } from "react-router-dom";

const Header = props => {
  const className = "nav-wrapper red accent-4";
  return (
    <nav>
      <div className={className}>
        <Link to="/" className="brand-logo">
          Logo
        </Link>
        <ul className="right">
          <li>
            <Link to="/me">Me</Link>
          </li>
          <li>
            {props.token ? (
              <Link
                to="/"
                onClick={() => {
                  props.logoutUser();
                }}
              >
                Logout
              </Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
          <li>
            <a
              href="https://github.com/jackdbd/fullstack-express-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
