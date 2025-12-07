import axios from "axios";

const API = axios.create({
  baseURL: "https://bookmyshow-server-json.onrender.com/movies",
});

export default API;
