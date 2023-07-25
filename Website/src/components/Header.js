import React from 'react';
import './styles.css';

function Header() {
  return (
    <header className="header">
      {/* Add your header content here */}
      <h1>Wander Wisely</h1>
      <nav>
        <ul>
          <li >Login</li>
          <li>SignUp</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
