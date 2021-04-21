import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          HOME
        </NavLink>
      </li>
      <li>
        <NavLink to="/browse" exact>
          BROWSE
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/webinars/user/${auth.userId}`} exact>
            MY WEBINARS
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={"/webinars/new"} exact>
            ADD WEBINAR
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={"/profile"} exact>
            PROFILE
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth" exact>
            LOGIN
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <a href="/">
            <button onClick={auth.logout}>LOGOUT</button>
          </a>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
