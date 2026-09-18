import axios from "axios";

const api = axios.create({
  baseURL: "https://assignment-job-portal-api.onrender.com",
});

export default api;