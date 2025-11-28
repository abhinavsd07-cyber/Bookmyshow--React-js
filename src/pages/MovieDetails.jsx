import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import api from "../services/api";
import "./MovieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    api.get(`/movies/${id}`).then((res) => setMovie(res.data));
  }, [id]);

  const handleProceed = () => {
    if (!selectedTheatre || !selectedTime) {
      alert("Please select theatre and showtime");
      return;
    }
    navigate(`/seat-selection/${id}/${selectedTheatre}/${encodeURIComponent(selectedTime)}`);
  };

  return (
    <Container className="mt-5">
      <Row>
        {/* Movie Poster */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Img
              src={movie.poster}
              alt={movie.title}
              className="movie-details-img"
            />
          </Card>
        </Col>

        {/* Movie Info */}
        <Col md={8}>
          <h2 className="text-danger fw-bold">{movie.title}</h2>

          <p className="text-muted mb-1">{movie.genre}</p>
          <p className="mb-1"><strong>Duration:</strong> {movie.duration}</p>
          <p className="mb-3"><strong>Rating:</strong> ⭐ {movie.rating}/10</p>

          {/* Theatre Selection */}
          <h5 className="mt-4">Select Theatre</h5>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {movie.theatres?.map((t) => (
              <Button
                key={t.id}
                variant={selectedTheatre == t.id ? "danger" : "outline-danger"}
                onClick={() => setSelectedTheatre(t.id)}
              >
                {t.name}
              </Button>
            ))}
          </div>

          {/* Showtime Selection */}
          {selectedTheatre && (
            <>
              <h5 className="mt-4">Select Showtime</h5>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {movie.theatres
                  .find((t) => t.id == selectedTheatre)
                  ?.showtimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "danger" : "outline-danger"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
              </div>
            </>
          )}

          <Button
            className="mt-4 px-4 py-2"
            variant="danger"
            onClick={handleProceed}
          >
            Proceed to Seat Selection
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
