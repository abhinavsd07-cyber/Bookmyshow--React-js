import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import SeatSelection from "./pages/SeatSelection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Router>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/theatres/:movieId" element={<SeatSelection />} />
          {/* Add other routes here */}
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
