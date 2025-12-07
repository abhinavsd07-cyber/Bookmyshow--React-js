import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TheatreSelection.css";

const TheatreSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Convert movieId to number to match db.json
    const numericMovieId = Number(movieId);

    axios
      .get(`https://bookmyshow-server-json.onrender.com/movies/${numericMovieId}`)
      .then((res) => {
        setMovie(res.data);
        setError(null);
      })
      .catch(() => setError("Failed to fetch theatre list"))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <p className="ts-loading">Loading theatres...</p>;
  if (error) return <p className="ts-error">{error}</p>;
  if (!movie) return <p className="ts-error">Movie not found</p>;

  return (
    <div className="ts-wrapper">
      <h1 className="ts-heading text-light">Available Theatres for {movie.title}</h1>

      <div className="ts-theatre-list">
        {movie?.theatres?.map((theatre) => (
          <div className="ts-theatre-card" key={theatre.id}>

            {/* Theatre Details */}
            <div className="ts-theatre-info">
              <h2 className="text-light">{theatre.name}</h2>
              <p className="ts-id text-light">Theatre ID: {theatre.id}</p>
              <p className="ts-location text-light">{theatre.location}</p>
              {theatre.screen && <p className="ts-small">Screen: {theatre.screen}</p>}
              {theatre.phone && <p className="ts-small">Contact: {theatre.phone}</p>}
            </div>

            {/* Shows */}
            <div className="ts-showtimes">
              {theatre?.shows?.map((show) => (
                <div className="ts-show-card" key={show.showId}>
                  <h5 className="ts-show-time text-light">{show.time}</h5>
                  <p className="ts-show-date text-light">{show.date}</p>
                  {show.type && <p className="ts-show-type">{show.type}</p>}

                  {/* Price from seats (recliner as default) */}
                  {show.seats?.recliner && (
                    <p className="ts-show-price">₹{show.seats.recliner.price}</p>
                  )}

                  <button
                    className="ts-show-btn"
                    aria-label={`Book seat for ${movie.title} at ${theatre.name} on ${show.date} at ${show.time}`}
                    onClick={() =>
                      navigate(`/seat/${movie.id}/${theatre.id}/${show.showId}`)
                    }
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatreSelection;
