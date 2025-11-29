// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const [premieres, setPremieres] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/movies").then(res => setMovies(res.data));

    // new sections (dummy data)
    setEvents([
      {
        id: 201,
        title: "Arijit Singh Live",
        poster:
          "https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-arijit-singh-concert-2024.jpg",
        genre: "Music Concert",
      },
      {
        id: 202,
        title: "Stand-up Comedy Night",
        poster:
          "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600/et00384356-mftfcpzvct-portrait.jpg",
        genre: "Comedy",
      },
    ]);

    setPremieres([
      {
        id: 301,
        title: "Deadpool 3",
        poster:
          "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600/et00384374-yffsdh2mgw-portrait.jpg",
        genre: "Action",
      },
      {
        id: 302,
        title: "Pushpa 2",
        poster:
          "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600/et00354692-kupjxsgrke-portrait.jpg",
        genre: "Thriller",
      },
    ]);
  }, []);

  return (
    <div  style={{ paddingTop: "70px" }}>

      {/* --------------------------- CAROUSEL ---------------------------- */}
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
  {/* -------------------- NOW SHOWING -------------------- */}
  <h2 className="section-title">Now Showing</h2>
  <div className="scroll-row">
    {movies.map((movie) => (
      <div key={movie.id} className="scroll-card">
        <Card className="movie-card">
          <Card.Img variant="top" src={movie.poster} className="movie-img" />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Text>{movie.genre}</Card.Text>
            <Button variant="danger" className="w-100">
              Book Now
            </Button>
          </Card.Body>
        </Card>
      </div>
    ))}
  </div>

  {/* -------------------- LIVE EVENTS -------------------- */}
  <h2 className="section-title">Live Events</h2>
  <div className="scroll-row">
    {events.map((e) => (
      <div key={e.id} className="scroll-card">
        <Card className="movie-card">
          <Card.Img variant="top" src={e.poster} className="movie-img" />
          <Card.Body>
            <Card.Title>{e.title}</Card.Title>
            <Card.Text>{e.genre}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    ))}
  </div>

  {/* -------------------- PREMIERES -------------------- */}
  <h2 className="section-title">Premieres</h2>
  <div className="scroll-row">
    {premieres.map((p) => (
      <div key={p.id} className="scroll-card">
        <Card className="movie-card">
          <Card.Img variant="top" src={p.poster} className="movie-img" />
          <Card.Body>
            <Card.Title>{p.title}</Card.Title>
            <Card.Text>{p.genre}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    ))}
  </div>
</Container>

    </div>
  );
}
