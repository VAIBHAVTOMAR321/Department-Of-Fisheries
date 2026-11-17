import React from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";
import LogoImage from "../LogoImage.jsx";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="brand footer-logo">
            <span className="brand-mark">
              <LogoImage />
            </span>
            <span>Department of Fisheries</span>
          </div>
          <p>
            Supporting sustainable fisheries, aquaculture and fish-farming
            livelihoods across Uttarakhand.
          </p>
        </div>
        <div>
          <h4>Fisheries</h4>
          <Link to="/categories">Fish species</Link>
          <Link to="/shop">Farmers’ marketplace</Link>
          <Link to="/contact">Department contact</Link>
        </div>
        <div>
          <h4>Department portal</h4>
          <Link to="/">Home</Link>
          <Link to="/about">Department services</Link>
          <Link to="/">Uttarakhand</Link>
        </div>
        <div>
          <h4>Location</h4>
          <p>
            <MapPin size={14} /> Uttarakhand, India
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Department of Fisheries, Uttarakhand{" "}
        <span>Supporting sustainable freshwater fisheries.</span>
      </div>
    </footer>
  );
}
