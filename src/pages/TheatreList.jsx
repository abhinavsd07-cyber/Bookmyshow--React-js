import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Button, Card } from "react-bootstrap";

export default function TheatreList() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    api.get(`/theatres?movieId=${movieId}`).then((res) => setTheatres(res.data));
  }, [movieId]);

  return (
    <Container style={{ paddingTop: "70px" }}>
      <h2>Theatres & Showtimes</h2>
      {theatres.map((th) => (
        <Card key={th.id} style={{ marginBottom: "20px" }}>
          <Card.Body>
            <h5>{th.name}</h5>
            {th.showtimes.map((time) => (
              <Button
                key={time}
                style={{ marginRight: "10px", marginTop: "10px" }}
                variant="danger"
                onClick={() => navigate(`/seats/${movieId}/${th.id}/${time}`)}
              >
                {time}
              </Button>
            ))}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
