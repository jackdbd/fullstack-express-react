import React from "react";
import { Link } from "react-router-dom";

const Header = props => {
  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">
          Logo
        </Link>
        <ul className="right">
          <li>
            <Link to="/me">Me</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <a
              href="https://github.com/jackdbd/fullstack-express-react"
              target="_blank"
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
