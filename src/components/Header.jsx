import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";
import api from "../services/api";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Fetch movies while typing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    api.get("/movies").then(res => {
      const filtered = res.data.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    });
  }, [query]);

  const submitSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setResults([]);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submitSearch();
  };

  return (
    <header className="header p-4">
      <div className="header-container">

        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo">BookMyShow</Link>
        </div>

        {/* Search */}
        <div className="search-container">
          <BiSearch className="search-icon" onClick={submitSearch} />

          <input
            type="text"
            placeholder="Search for Movies, Events, Shows..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />

          {/* Search Results Dropdown */}
          {results.length > 0 && (
            <div className="search-results-box">
              {results.map(movie => (
                <div
                  key={movie.id}
                  className="search-result-item"
                  onClick={() => {
                    navigate(`/movie/${movie.id}`);
                    setResults([]);
                    setQuery("");
                  }}
                >
                  <img src={movie.poster} alt="" />
                  <span>{movie.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="menu-container">
          <ul className={`menu ${menuOpen ? "menu-mobile-open" : ""}`}>
            <li className="text-light" onClick={() =>
              document.getElementById("now-showing").scrollIntoView({ behavior: "smooth" })
            }>Home</li>

            <li className="text-light" onClick={() =>
              document.getElementById("now-showing").scrollIntoView({ behavior: "smooth" })
            }>Movies</li>

            <li className="text-light" onClick={() =>
              document.getElementById("events").scrollIntoView({ behavior: "smooth" })
            }>Events</li>

            <li className="text-light" onClick={() =>
              document.getElementById("premieres").scrollIntoView({ behavior: "smooth" })
            }>Premieres</li>

            <li className="text-light" onClick={() =>
              document.getElementById("contact").scrollIntoView({ behavior: "smooth" })
            }>Contact</li>
          </ul>

          {/* Mobile Menu Toggle */}
          <div
            className="mobile-menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
