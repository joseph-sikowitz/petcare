import { Link, useLocation } from "react-router";
import { useUser } from "../context/UserContext.jsx";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const user = useUser();

  const isOwner = user?.owner === true;

  const isBusinessDashboard =
    location.pathname === "/business/dashboard" ||
    location.pathname === "/business";

  const logoPath = isOwner ? "/business/dashboard" : "/user/dashboard";

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link className="navbar-brand" to={logoPath}>
          <span className="navbar-logo" aria-hidden="true">
            🐾
          </span>
          PetCare
        </Link>

        <div className="navbar-links">
          <Link to="/user/dashboard">Home</Link>

          {!isOwner && <Link to="/services">Services</Link>}

          {isOwner && !isBusinessDashboard && (
            <Link to="/business/dashboard">Dashboard</Link>
          )}

          {user ? (
            <>
              <div className="navbar-welcome">
                Welcome, {user.firstName} {user.lastName}!
              </div>
              <a href="/api/auth/logout">Logout</a>
            </>
          ) : (
            <Link to="/login" className="navbar-login">
              Log In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
