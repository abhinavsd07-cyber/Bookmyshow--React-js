import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";
import API from "../services/api";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Fetch movies when typing
  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      const res = await API.get(`/movies?title_like=${search}`);
      setResults(res.data);
    };

    fetchResults();
  }, [search]);

  const handleSelectMovie = (id) => {
    setSearch("");
    setResults([]);
    navigate(`/movie/${id}`);
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO */}
        <div className="logo-container">
          <Link to="/" className="logo">BookMyShow</Link>
        </div>

        {/* MENU LINKS */}
        <div className="menu-search-container">

          <ul className={`menu ${menuOpen ? "menu-mobile-open" : ""}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/premieres">Premieres</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          {/* SEARCH BAR */}
          <div className="search-box">
            <BiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* RESULTS DROPDOWN */}
            {results.length > 0 && (
              <div className="search-results">
                {results.map((movie) => (
                  <div
                    key={movie.id}
                    className="search-item"
                    onClick={() => handleSelectMovie(movie.id)}
                  >
                    <img src={movie.poster} alt="" />
                    <span>{movie.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
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
