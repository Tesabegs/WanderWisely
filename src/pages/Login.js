import React, { useState } from 'react';
import './styles.css';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here using email and password
    console.log('Login form submitted');
  };

  return (
    <div className='login-container'>
      <h1 className='login-head'>Login </h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className='form-input'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className='form-input'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit"  className='submit-button'>Login</button>
      </form>
    </div>
  );
}

export default Login;
