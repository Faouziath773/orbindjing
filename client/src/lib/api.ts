import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: baseURL && baseURL.trim().length > 0 ? baseURL : "/api",
});

export default api;
