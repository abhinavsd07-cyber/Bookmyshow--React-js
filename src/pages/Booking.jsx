// src/pages/Booking.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Button } from "react-bootstrap";
import "./Booking.css";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    api.get(`/movies/${id}`).then(res => setMovie(res.data));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    // Save booking to backend
    api.post("/bookings", {
      movieId: movie.id,
      seats: selectedSeats
    }).then(() => {
      alert("Booking successful!");
      navigate("/");
    });
  };

  return (
    <Container style={{ paddingTop: "70px" }}>
      <h2>{movie.title}</h2>
      <p>{movie.genre}</p>
      <p>Duration: {movie.duration}</p>

      <h4>Select Seats:</h4>
      <div className="seats-container">
        {movie.theatres[0].seats.map(seat => (
          <div
            key={seat.id}
            className={`seat ${seat.booked ? "booked" : selectedSeats.includes(seat.id) ? "selected" : ""}`}
            onClick={() => !seat.booked && toggleSeat(seat.id)}
          >
            {seat.id}
          </div>
        ))}
      </div>

      <Button variant="danger" onClick={handleBooking} className="mt-3">
        Confirm Booking
      </Button>
    </Container>
  );
}
