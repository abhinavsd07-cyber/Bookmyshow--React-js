// src/services/api.js
import axios from "axios";

// Replace the port with your running JSON server port
const api = axios.create({
  baseURL: "http://localhost:3000", // <-- change this to 5000
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
