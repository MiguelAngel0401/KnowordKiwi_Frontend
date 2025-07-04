import axios from "axios";

const publicApiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Opcional: Interceptores de respuesta para manejar errores generales
publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores generales (ej. logger, notificaciones al usuario)
    console.error("Error en solicitud pública:", error);
    return Promise.reject(error);
  },
);

export default publicApiClient;
