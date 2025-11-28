// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/movies")
      .then(res => setMovies(res.data))
      .catch(err => console.error("Failed to fetch movies", err));
  }, []);

  const goToTheatre = (movie) => {
    const theatre = movie.theatres[0];
    const time = theatre.showtimes[0];
    navigate(`/seat-selection/${movie.id}/${theatre.id}/${encodeURIComponent(time)}`);
  };

  return (
    <div>

      {/* ✅ Bootstrap Carousel (Corrected className) */}
      <div id="carouselExampleIndicators" className="carousel slide mb-4">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img 
              src="https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1763188137924_linkinparkwebnew.jpg" 
              className="d-block w-100" 
              alt="slide1" 
            />
          </div>

          <div className="carousel-item">
            <img 
              src="https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1761907921032_amusementparkdesktop.jpg" 
              className="d-block w-100" 
              alt="slide2" 
            />
          </div>

          <div className="carousel-item">
            <img 
              src="https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1762856240840_littleboxofsweetsweb.jpg" 
              className="d-block w-100" 
              alt="slide3" 
            />
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Now Showing */}
      <Container>
        <h2 className="text-danger mb-4">Now Showing</h2>

        <Row>
          {movies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              
              {/* 🎬 Movie Card */}
              <Card className="shadow-sm movie-card">
                
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-img"
                />

                <Card.Body>
                  <Card.Title className="text-center movie-title">{movie.title}</Card.Title>

                  <Card.Text className="text-muted small">
                    <b>Genre:</b> {movie.genre} <br />
                    <b>Rating:</b> {movie.rating}/10 <br />
                    <b>Duration:</b> {movie.duration}
                  </Card.Text>

                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => goToTheatre(movie)}
                  >
                    Book Now
                  </Button>

                </Card.Body>

              </Card>

            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
