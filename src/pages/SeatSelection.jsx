import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Button } from "react-bootstrap";
import "./SeatSelection.css";

export default function SeatSelection() {
  const { movieId, theatreId, time } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    api.get(`/seats?movieId=${movieId}&theatreId=${theatreId}&time=${time}`)
      .then((res) => setSeats(res.data));
  }, [movieId, theatreId, time]);

  const toggleSeat = (index) => {
    if (seats[index].booked) return;
    const newSeats = [...seats];
    newSeats[index].selected = !newSeats[index].selected;
    setSeats(newSeats);
  };

  const proceedPayment = () => {
    const selectedSeats = seats.filter(s => s.selected).map(s => s.number);
    navigate(`/payment/${movieId}/${theatreId}/${time}`, { state: { selectedSeats } });
  };

  return (
    <Container style={{ paddingTop: "70px" }}>
      <h2>Select Seats</h2>
      <div className="seat-grid">
        {seats.map((s, idx) => (
          <div
            key={idx}
            className={`seat ${s.booked ? "booked" : s.selected ? "selected" : "available"}`}
            onClick={() => toggleSeat(idx)}
          >
            {s.number}
          </div>
        ))}
      </div>
      <Button variant="danger" onClick={proceedPayment} style={{ marginTop: "20px" }}>
        Proceed to Pay
      </Button>
    </Container>
  );
}
