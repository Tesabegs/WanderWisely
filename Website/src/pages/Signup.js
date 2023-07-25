import React, { useState } from 'react';
import './styles.css';


function Signup() {
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlefirstNameChange = (e) => {
    setfirstName(e.target.value);
  };

  const handlelastNameChange = (e) => {
    setlastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup form submitted');
  };

  return (
    <div className='login-container'>
      <h1 className='login-head'>Sign Up </h1>
      <form className='login-form' onSubmit={handleSubmit}>
      <div className='form-group'>
          <label htmlFor="firstName">First Name</label>
          <input
            type="firstName"
            id="firstName"
            className='form-input'
            value={firstName}
            onChange={handlefirstNameChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="lastName"
            id="lastName"
            className='form-input'
            value={lastName}
            onChange={handlelastNameChange}
          />
        </div>
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
        <button type="submit" className='submit-button'>Create Account</button>
      </form>
    </div>
  );
}

export default Signup;
