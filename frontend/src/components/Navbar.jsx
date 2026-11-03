import { Link } from "react-router";

import { useUser } from "../context/UserContext.jsx";

import "./Navbar.css";

function Navbar() {
  const user = useUser();

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link className="navbar-brand" to="/">
          <span className="navbar-logo" aria-hidden="true">
            🐾
          </span>
          PetCare
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          {user ? (
            <>
              {<Link to="/dashboard">Dashboard</Link>}
              <a href="/api/auth/logout">Logout</a>
              <div> Welcome, {user.firstName} {user.lastName}!</div>
            </>) : (
              <Link to="/login" className="navbar-login">Log In</Link>
            )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
