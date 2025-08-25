import axios from "axios";

const api = axios.create({
  baseURL: "https://crud-user-api-pi.vercel.app", // URL base do backend
});

// Interceptor que adiciona o token a cada requisição autenticada
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;