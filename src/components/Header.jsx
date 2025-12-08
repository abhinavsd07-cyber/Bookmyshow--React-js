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

  // Fetch search results
  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await API.get(`/movies?title_like=${search}`);
        setResults(res.data);
      } catch (error) {
        console.log("Search error:", error);
      }
    };

    fetchResults();
  }, [search]);

  const handleSelectMovie = (id) => {
    setSearch("");
    setResults([]);
    navigate(`/movie/${id}`);
  };

  // Scroll to a section on homepage
  const goToSection = (id) => {
    navigate("/"); // Go to home page

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);

    setMenuOpen(false);
  };

  return (
    <header className="header p-4">
      <div className="header-container">
        {/* LOGO */}
        <div className="logo-container">
          <Link to="/" className="logo">
            BookMyShow
          </Link>
        </div>

        <div className="menu-search-container">
          {/* MENU LINKS */}
          <ul className={`menu ${menuOpen ? "menu-mobile-open" : ""}`}>
            <li className="text-light"onClick={() => goToSection("now-showing")}>Movies</li>
            <li className="text-light"onClick={() => goToSection("events")}>Events</li>
            <li className="text-light"onClick={() => goToSection("premieres")}>Premieres</li>
            <li  className="text-light"onClick={() => goToSection("contact")}>Contact</li>
          </ul>

          {/* SEARCH BOX */}
          <div className="search-box">
            <BiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* SEARCH RESULTS */}
            {results.length > 0 && (
              <div className="search-results">
                {results.map((movie) => (
                  <div
                    key={movie.id}
                    className="search-item"
                    onClick={() => handleSelectMovie(movie.id)}
                  >
                    <img src={movie.poster} alt={movie.title} />
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
