import axios from "axios";

const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Permite enviar cookies en cada solicitud
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
