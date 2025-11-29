import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Button } from "react-bootstrap";
import "./MovieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    api.get(`/movies/${id}`).then((res) => setMovie(res.data));
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <Container style={{ paddingTop: "70px" }}>
      <div className="movie-details">
        <img src={movie.poster} alt={movie.title} className="movie-detail-img" />
        <div className="movie-detail-info">
          <h2>{movie.title}</h2>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p><strong>Runtime:</strong> {movie.runtime}</p>
          <p>{movie.description}</p>
          <Button variant="danger" onClick={() => navigate(`/theatre/${id}`)}>
            Proceed
          </Button>
        </div>
      </div>
    </Container>
  );
}
