// src/components/Header.jsx
import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <Navbar   expand="lg" style={{backgroundColor:"black"}}>
      <Container>
        <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src="https://static.vecteezy.com/system/resources/previews/050/816/799/non_2x/bookmyshow-transparent-icon-free-png.png" alt=""  style={{height:"100px"}}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate("/")} className="text-light">Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/bookings")}className="text-light">My Bookings</Nav.Link>
            {/* Optional: Add Login/Logout buttons */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
