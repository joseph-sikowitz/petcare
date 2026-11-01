import { Link } from "react-router";
import "./Navbar.css";

function Navbar() {
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
          <Link to="/login" className="navbar-login">
            Log In
          </Link>{" "}
          {/* For Joe login use */}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
