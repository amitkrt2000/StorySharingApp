import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import `useNavigate` to navigate to different pages
import '../styles/Navbar.css';  // Make sure your CSS file is linked properly

const Navbar = () => {
  const navigate = useNavigate();  // Hook to navigate between routes

  return (
    <nav className="nav">
      {/* Register button navigates to /register */}
      <button className="register" onClick={() => navigate('/register')}>Register</button>

      {/* Sign In button navigates to /login */}
      <button className="signin" onClick={() => navigate('/login')}>Sign In</button>
    </nav>
  );
};

export default Navbar;
