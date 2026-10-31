import "./Navbar.css";

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <a className="navbar-brand" href="/">
          <span className="navbar-logo" aria-hidden="true">🐾</span>
          PetCare
        </a>

        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/login" className="navbar-login">Log In</a> {/* For Joe login use */}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
