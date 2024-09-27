import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the navigate function
import '../styles/Login.css'; // Import the custom CSS for the Login modal

const Login = () => { // Remove onClose prop for simplicity
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to track if password is visible
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send the form data
      });

      const data = await response.json();
      console.log(data); // Add logging to debug response

      if (response.ok) {
        // Store token in localStorage for further authenticated requests
        localStorage.setItem('auth-token', data.token);
        alert('Logged in successfully!');
        setUsername('');
        setPassword('');
        setErrorMessage(''); // Clear the error message if login is successful
        navigate('/'); // Redirect to the homepage (or wherever you want) after login
      } else {
        setErrorMessage(data.message || 'Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('Failed to login. Please try again later.');
      console.error("Error:", error); // Add logging for errors
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="login-modal">
      <div className="login-content">
        <h2 className="login-heading">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password' based on state
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <span
                className="show-password"
                onClick={togglePasswordVisibility}  // Call function to toggle visibility
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
