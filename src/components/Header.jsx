import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo">
            BookMyShow
          </Link>
        </div>

        {/* Menu + Search */}
        <div className="menu-search-container">
          <ul className={`menu ${menuOpen ? "menu-mobile-open" : ""}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/premieres">Premieres</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          {/* Search + Mobile Menu */}
          <div className="icons">
            <BiSearch className="icon" />
            <div
              className="mobile-menu-icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
