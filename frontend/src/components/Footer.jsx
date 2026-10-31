import "./Footer.css";

// Footer to be used for every page standardization
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div>
          <p className="footer-brand">🐾 PetCare</p>
          <p className="footer-description">
            Caring for your pets, one appointment at a time.
          </p>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} PetCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
