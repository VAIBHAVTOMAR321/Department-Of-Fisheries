import { Link } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-xl">
        <div className="footer-main">
          <div className="footer-brand">
            <BrandMark light />
            <p>Supporting sustainable freshwater fisheries and fish-farming livelihoods across Uttarakhand.</p>
            <div className="footer-socials" aria-label="Social media">
              <Link to="https://instagram.com" aria-label="Instagram"><i className="bi bi-instagram" /></Link>
              <Link to="https://facebook.com" aria-label="Facebook"><i className="bi bi-facebook" /></Link>
              <Link to="https://wa.me/918001234567" aria-label="WhatsApp"><i className="bi bi-whatsapp" /></Link>
            </div>
          </div>
          <div className="footer-links">
            <h3>Explore</h3>
            <Link to="/categories">Fish species</Link>
            <Link to="/shop">Shop Now</Link>
            <Link to="/about">Department services</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-links">
            <h3>Here to help</h3>
            <Link to="/contact">Ask a question</Link>
            <Link to="/contact">Fisheries support</Link>
            <Link to="/contact">Farmer enquiries</Link>
          </div>
          <div className="footer-newsletter">
            <h3>Ordering information</h3>
            <p>This website is a static catalogue preview. Contact our team for current availability and ordering.</p>
            <Link className="footer-order-link" to="/contact">Talk to our team <i className="bi bi-arrow-up-right ms-1" /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Department of Fisheries, Uttarakhand</span>
          <div><Link to="/contact">Contact</Link><Link to="/about">Department services</Link></div>
          <span>Sustainable freshwater fisheries</span>
          <span>Designed by <Link to="https://brainrock.in" target="_blank" rel="noopener noreferrer">Brainrock</Link></span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
