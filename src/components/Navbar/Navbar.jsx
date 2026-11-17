import React, { useState } from "react";
import { Menu, ArrowUpRight, ShoppingCart, X } from "lucide-react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import LogoImage from "../LogoImage.jsx";
export default function Navbar({ onLogin, onRegister, cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  return (
    <header className="site-nav">
      <Link className="brand" to="/" onClick={closeMenu}>
        <span className="brand-mark">
          <LogoImage />
        </span>
        <span className="brand-copy">
          <strong>Department of Fisheries</strong>
          <small>UTTARAKHAND</small>
        </span>
      </Link>
      <div className={`site-nav-menu ${isOpen ? "open" : ""}`}>
        <nav>
          <NavLink className="nav-link" to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink className="nav-link" to="/categories" onClick={closeMenu}>Fish species</NavLink>
          <NavLink className="nav-link" to="/shop" onClick={closeMenu}>Shop Now</NavLink>
          <NavLink className="nav-link" to="/contact" onClick={closeMenu}>Contact</NavLink>
        </nav>
        <div className="nav-actions">
          <Link className="nav-cart" to="/cart" onClick={closeMenu} aria-label={`Shopping cart, ${cartCount} kilograms`}>
            <ShoppingCart size={16} /> Basket {cartCount ? <span>{cartCount} kg</span> : ""}
          </Link>
          <button className="nav-login" onClick={() => { closeMenu(); onLogin(); }}>
            Dashboard login
          </button>
          <button className="nav-register" onClick={() => { closeMenu(); onRegister(); }}>
            Join as a partner <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <button
        className="mobile-menu"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={18} /> : <Menu />}
      </button>
    </header>
  );
}
