import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import TheatreSelection from "./pages/TheatreSelection";
import SeatSelection from "./pages/SeatSelection";
import Booking from "./pages/Booking";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // required for carousel


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Movie Details */}
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* Theatre Selection */}
        <Route path="/select-theatre/:movieId" element={<TheatreSelection />} />

        {/* Seat Selection */}
        <Route
          path="/seat/:movieId/:theatreId/:showId"
          element={<SeatSelection />}
        />

        {/* Booking Confirmation */}
        <Route path="/book/:showId" element={<Booking />} />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <h1 style={{ textAlign: "center", marginTop: "50px" }}>
              Page Not Found
            </h1>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
