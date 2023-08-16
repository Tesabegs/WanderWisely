import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      {/* Add your header content here */}
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
        <h3>Wander Wisely</h3>
      </Link>    
    </header>
  );
}

export default Header;
