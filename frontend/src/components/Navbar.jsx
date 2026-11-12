import { Link, useLocation } from "react-router";
import { useUser } from "../context/UserContext.jsx";
import "./Navbar.css";

function Navbar() {
  const user = useUser();
  const location = useLocation();

  const isOwner = user?.owner === true;
  const isProfilePage = location.pathname === "/user/dashboard";
  const isBusinessDashboard =
    location.pathname === "/business/dashboard" ||
    location.pathname === "/business";

  const dashboardPath = isOwner
    ? "/business/dashboard"
    : "/user/dashboard";

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link className="navbar-brand" to={dashboardPath}>
          <span className="navbar-logo" aria-hidden="true">
            🐾
          </span>
          PetCare
        </Link>

        <div className="navbar-links">
          {(!isOwner || !isBusinessDashboard) && (
            <Link to={dashboardPath}>Dashboard</Link>
          )}

          {isOwner && !isProfilePage && (
            <Link to="/user/dashboard">Profile</Link>
          )}

          {!isOwner && <Link to="/services">Services</Link>}

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

Navbar.propTypes = {}

export default Navbar;
