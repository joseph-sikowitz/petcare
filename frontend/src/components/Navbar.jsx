import { Link } from "react-router";
import PropTypes from "prop-types";

import "./Navbar.css";

function Navbar({ user }) {
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
              {/*<Link to="/profile">Profile ({user.firstName} {user.lastName})</Link>*/}
              <div> Welcome, {user.firstName} {user.lastName}!</div>
              <a href="/api/auth/logout">Logout</a>
            </>) : (
              <Link to="/login" className="navbar-login">Log In</Link>
            )}
        </div>
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  businessName: PropTypes.string,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zipCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  owner: PropTypes.bool,
}),
};

export default Navbar;
