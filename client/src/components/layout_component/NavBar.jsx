import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Style_Css/NavBar.css';

const NavBar = () => {
  return (
    <nav>
      <div className="logo">Profile Link</div>
      <div className="nav-links">
        <NavLink to="/">Web</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign up</NavLink>
      </div>
    </nav>
  )
}

export default NavBar;
