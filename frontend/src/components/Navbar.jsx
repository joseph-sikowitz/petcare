import { Link } from "react-router";
import { useUser } from "../context/UserContext.jsx";
import "./Navbar.css";

function Navbar() {
  const user = useUser();
  const isOwner = user?.owner === true;

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link
          className="navbar-brand"
          to={isOwner ? "/business/dashboard" : "/"}
        >
          <span className="navbar-logo" aria-hidden="true">
            🐾
          </span>
          PetCare
        </Link>

        <div className="navbar-links">
          <Link to={isOwner ? "/business/dashboard" : "/"}>Home</Link>
          <Link to={isOwner ? "/business/services" : "/services"}>
            Services
          </Link>
          {isOwner && (
            <Link to="/business/appointments">Appointments</Link>
          )}

          {user ? (
            <>
              <div className="navbar-welcome">Welcome, {user.firstName} {user.lastName}!</div>
              <a href="/api/auth/logout">Logout</a>
            </>
          ) : (
            <Link to="/login" className="navbar-login">Log In</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
