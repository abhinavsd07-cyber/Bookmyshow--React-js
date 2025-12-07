import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.css";


const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`https://bookmyshow-server-json.onrender.com/${id}`)
      .then(res => setMovie(res.data))
      .catch(() => alert("Failed to load movie details"));
  }, [id]);

  if (!movie) return <p className="movie-message">Loading...</p>;

  return (
    <div
      className="movie-bg"
      style={{ backgroundImage: `url(${movie.landscape})` }}
    >
      <div className="details-left-card">
        <h1 className="movie-title fs-1 ">{movie.title}</h1>
        <p className="movie-description">{movie.description}</p>

        <div className="meta-list">
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Duration:</strong> {movie.duration}</p>
          <p><strong>Rating:</strong> {movie.rating}/10</p>
          <p><strong>About:</strong> {movie.about}</p>
         
        </div>

        <button
          className="book-btn"
          onClick={() => navigate(`/select-theatre/${movie.id}`)}
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
