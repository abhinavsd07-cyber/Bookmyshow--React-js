// src/components/SeatSelection.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material"; // Only header
import Swal from "sweetalert2";
import api from "../services/api";

export default function SeatSelection() {
  const { movieId, theatreId, time } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({});
  const [theatre, setTheatre] = useState({});
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    api.get(`/movies/${movieId}`).then(res => {
      setMovie(res.data);
      const t = res.data.theatres.find(t => t.id === parseInt(theatreId));
      setTheatre(t);
      setSeats(t.seats);
    });
  }, [movieId, theatreId]);

  const toggleSeat = seat => {
    if (seat.booked) return; // Can't select booked seat
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return sum + (seat?.price || 0);
  }, 0);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      Swal.fire("Select seats", "Please select at least one seat", "warning");
      return;
    }

    api.post("/bookings", {
      movieId,
      theatreId,
      time,
      seats: selectedSeats,
      totalPrice
    }).then(() => {
      Swal.fire({
        icon: "success",
        title: "Booking Confirmed!",
        html: `
          <b>Movie:</b> ${movie.title}<br/>
          <b>Theatre:</b> ${theatre.name}<br/>
          <b>Time:</b> ${time}<br/>
          <b>Seats:</b> ${selectedSeats.join(", ")}<br/>
          <b>Total:</b> ₹${totalPrice}
        `
      }).then(() => navigate("/"));
    });
  };

  // Group seats by row
  const rows = {};
  seats.forEach(seat => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  const getSeatStyle = seat => {
    if (seat.booked) return "bg-secondary text-white";
    if (selectedSeats.includes(seat.id)) return "bg-success text-white";
    return seat.type === "vip" ? "bg-warning text-dark" : "bg-light";
  };

  return (
    <Container className="mt-4">
      {/* Header using Material UI */}
      <Typography variant="h4" color="error" gutterBottom>
        {movie.title} - {theatre.name} ({time})
      </Typography>

      {/* Seat Layout */}
      {Object.keys(rows).map(row => (
        <Row key={row} className="mb-2 justify-content-center align-items-center">
          <Col xs="auto" className="fw-bold">{row}</Col>
          {rows[row].map(seat => (
            <Col key={seat.id} xs="auto">
              <Button
                className={`m-1 ${getSeatStyle(seat)}`}
                style={{ width: 40, height: 40, borderRadius: 8 }}
                onClick={() => toggleSeat(seat)}
                disabled={seat.booked}
              >
                {seat.id}
              </Button>
            </Col>
          ))}
        </Row>
      ))}

      {/* Seat Legend */}
      <Row className="mt-3 mb-3 justify-content-center">
        <Col xs="auto"><Button className="bg-success text-white" disabled>Selected</Button></Col>
        <Col xs="auto"><Button className="bg-secondary text-white" disabled>Booked</Button></Col>
        <Col xs="auto"><Button className="bg-warning text-dark" disabled>VIP</Button></Col>
        <Col xs="auto"><Button className="bg-light" disabled>Regular</Button></Col>
      </Row>

      {/* Booking Summary */}
      <Card className="mt-4" style={{ maxWidth: 400, margin: "0 auto" }}>
        <Card.Body>
          <h5>Booking Summary</h5>
          <h5>Seats: {selectedSeats.join(", ") || "None"}</h5>
          <h5>Total Price: ₹{totalPrice}</h5>
          <Button className="mt-3 w-100 bg-danger text-white" onClick={handleBooking}>
            Confirm Booking
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
