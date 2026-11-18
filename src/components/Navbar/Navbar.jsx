import React, { useState } from "react";
import { ArrowUpRight, Menu, Search, ShoppingCart, X } from "lucide-react";
import "./Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoImage from "../LogoImage.jsx";
import CMImg from "../../assets/images/cm.jpg";
import MinisterImg from "../../assets/images/minister.jpg";
export default function Navbar({ onLogin, onRegister, cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const closeMenu = () => setIsOpen(false);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    closeMenu();
  };

  return (
    <>
      <div className="gov-topbar">
        <div className="gov-topbar-inner">
          <span>Government of Uttarakhand <i>•</i> Department of Fisheries</span>
          <Link to="/contact">Help &amp; support</Link>
        </div>
      </div>
      <header className="site-nav">
        <div className="site-nav-head">
          <Link className="brand" to="/" onClick={closeMenu}>
            <span className="brand-mark">
              <LogoImage />
            </span>
            <span className="brand-copy">
              <strong>Department of Fisheries</strong>
              <small>UTTARAKHAND</small>
            </span>
          </Link>
          <div className="nav-leaders">
            <div className="nav-leader-card">
              <img
                src={CMImg}
                alt="Shri Pushkar Singh Dhami"
              />
              <div>
                <strong>Shri Pushkar Singh Dhami</strong>
                <span>Hon'ble Chief Minister, Uttarakhand</span>
              </div>
            </div>
            <div className="nav-leader-card">
              <img
                src={MinisterImg}
                alt="Shri Saurabh Bahuguna"
              />
              <div>
                <strong>Shri Saurabh Bahuguna</strong>
                <span>Hon'ble Cabinet Minister, Fisheries</span>
              </div>
            </div>
          </div>
          <button
            className="mobile-menu"
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={18} /> : <Menu size={19} />}
          </button>
        </div>

        <div className={`site-nav-menu ${isOpen ? "open" : ""}`}>
          <nav aria-label="Main navigation">
            <NavLink className="nav-link" to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink className="nav-link" to="/shop" onClick={closeMenu}>Shop all</NavLink>
            <NavLink className="nav-link" to="/categories" onClick={closeMenu}>Categories</NavLink>
            <button className="nav-link" type="button" onClick={() => { closeMenu(); onRegister(); }}>
              Farmer &amp; vendor
            </button>
            <Link className="nav-link" to="/#marketplace-process" onClick={closeMenu}>How it works</Link>
            <NavLink className="nav-link" to="/about" onClick={closeMenu}>About department</NavLink>
            <button className="nav-link track-nav-link" type="button" onClick={() => { closeMenu(); onLogin(); }}>
              Track order <ArrowUpRight size={13} />
            </button>
            <NavLink className="nav-link nav-contact-mobile" to="/contact" onClick={closeMenu}>Contact</NavLink>
            <form className="nav-search" role="search" onSubmit={submitSearch}>
              <Search size={17} aria-hidden="true" />
              <label className="visually-hidden" htmlFor="marketplace-search">
                Search fish, farmers or locations
              </label>
              <input
                id="marketplace-search"
                type="search"
                placeholder="Search fish, farmers or districts..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit">Search</button>
            </form>
            <div className="nav-menu-actions">
              <button className="nav-login" type="button" onClick={onLogin}>
                Dashboard login
              </button>
              <Link className="nav-cart" to="/cart" onClick={closeMenu} aria-label={`Shopping cart, ${cartCount} kilograms`}>
                <ShoppingCart size={16} /> Basket {cartCount ? <span>{cartCount} kg</span> : ""}
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
