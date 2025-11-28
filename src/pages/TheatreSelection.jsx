// src/pages/TheatreSelection.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function TheatreSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({});
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    api.get(`/movies/${movieId}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error("Failed to fetch movie", err));
  }, [movieId]);

  const handleProceed = () => {
    if (!selectedTheatre || !selectedTime) {
      alert("Please select theatre and showtime!");
      return;
    }
    navigate(`/seat-selection/${movieId}/${selectedTheatre.id}/${selectedTime}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-danger mb-4">{movie.title} - Select Theatre & Showtime</h2>

      {/* Theatre Cards */}
      <div className="row">
        {movie.theatres && movie.theatres.map(theatre => (
          <div className="col-md-4 mb-3" key={theatre.id}>
            <div
              className={`card p-3 shadow ${selectedTheatre?.id === theatre.id ? "border-danger" : ""}`}
              onClick={() => {
                setSelectedTheatre(theatre);
                setSelectedTime(""); // reset time when theatre changes
              }}
              style={{ cursor: "pointer" }}
            >
              <h5>{theatre.name}</h5>
              <p>Available Showtimes:</p>
              <div className="d-flex flex-wrap">
                {theatre.showtimes.map(time => (
                  <button
                    key={time}
                    className={`btn btn-sm m-1 ${selectedTime === time ? "btn-danger" : "btn-outline-secondary"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTime(time);
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-danger mt-3" onClick={handleProceed}>
        Proceed to Seat Selection
      </button>
    </div>
  );
}
