import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container } from "react-bootstrap";
import "./Home.css";
import "../components/MovieCard.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const [premieres, setPremieres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/movies").then((res) => setMovies(res.data));
    api.get("/events").then((res) => setEvents(res.data));
    api.get("/premieres").then((res) => setPremieres(res.data));
  }, []);

  return (
    <div style={{ paddingTop: "70px" }}>
      {/* ------------------ CAROUSEL ------------------ */}
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1763188137924_linkinparkwebnew.jpg"
              className="d-block w-100 carousel-img"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1761907921032_amusementparkdesktop.jpg"
              className="d-block w-100 carousel-img"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1762856240840_littleboxofsweetsweb.jpg"
              className="d-block w-100 carousel-img"
            />
          </div>
        </div>
      </div>

      <Container>
        {/* ------------------ NOW SHOWING ------------------ */}
        <h2 className="section-title">Now Showing</h2>
        <div className="section-scroll">
          <div className="section-row">
            {movies.map((m) => (
              <div key={m.id} className="movie-card">
                <img src={m.poster} className="movie-img" />
                <div className="card-body">
                  <h5 className="card-title">{m.title}</h5>
                  <p className="card-text">{m.genre}</p>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => navigate(`/book/${m.id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------ LIVE EVENTS ------------------ */}
        <h2 className="section-title">Live Events</h2>
        <div className="section-scroll">
          <div className="section-row">
            {events.map((ev) => (
              <div key={ev.id} className="live-card">
                <img src={ev.poster} className="live-img" />
                <div className="live-card-body">
                  <h5>{ev.title}</h5>
                  <p>{ev.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------ PREMIERES ------------------ */}
        <h2 className="section-title">Premieres</h2>
        <div className="section-scroll">
          <div className="section-row">
            {premieres.map((pr) => (
              <div key={pr.id} className="premiere-card">
                <img src={pr.poster} className="premiere-img" />
                <div className="live-card-body">
                  <h5>{pr.title}</h5>
                  <p>{pr.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
