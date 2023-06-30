import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import { clearUserSession } from '../gossipNetwork';

function Header() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    clearUserSession();  // clear the user session
    setUser(null);
  };
  
  return (
    <Navbar className="d-flex justify-content-between" style={{ marginRight: '20px' }}>
      <Navbar.Brand as={Link} to="/" className="header-title" style={{ color: '#fff' }}>
        Open Forum
      </Navbar.Brand>
      {user && (
        <Nav.Link as={Link} to="/post-document" className="text-light" style={{ paddingLeft: '20px' }}>Post Document</Nav.Link>
      )}
      <div>
        <Nav>
          {user ? (
            <>
              <Nav.Link as={Link} to="/profile" className="text-light">Profile</Nav.Link>
              <Nav.Link as={Link} to="/" className="text-light" onClick={handleLogout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/register" className="text-light">Register</Nav.Link>
              <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
            </>
          )}
        </Nav>
      </div>
    </Navbar>
  );
}

export default Header;
