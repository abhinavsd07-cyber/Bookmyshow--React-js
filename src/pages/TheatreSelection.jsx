import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TheatreSelection.css";

const TheatreSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`https://bookmyshow-server-json.onrender.com/${movieId}`)
      .then((res) => setMovie(res.data))
      .catch(() => console.log("Failed to fetch theatre list"));
  }, [movieId]);

  if (!movie) return <p className="ts-loading">Loading theatres...</p>;

  return (
    <div className="ts-wrapper">
      <h1 className="ts-heading text-light">Available Theatres</h1>

      <div className="ts-theatre-list">
        {movie.theatres.map((theatre) => (
          <div className="ts-theatre-card" key={theatre.id}>

            {/* Theatre Details */}
            <div className="ts-theatre-info">
              <h2 className="text-dark">{theatre.name}</h2>
              <p className="ts-id">Theatre ID: {theatre.id}</p>
              <p className="ts-location">{theatre.location}</p>

              {theatre.screen && <p className="ts-small">Screen: {theatre.screen}</p>}
              {theatre.phone && <p className="ts-small">Contact: {theatre.phone}</p>}
            </div>

            {/* Shows */}
            <div className="ts-showtimes">
              {theatre.shows.map((show) => (
                <div className="ts-show-card" key={show.showId}>
                  
                  <h3 className="ts-show-time text-dark">{show.time}</h3>
                  <p className="ts-show-date text-dark">{show.date}</p>

                  {show.type && <p className="ts-show-type">{show.type}</p>}
                  {show.price && <p className="ts-show-price">₹{show.price}</p>}

                  <button
                    className="ts-show-btn"
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
