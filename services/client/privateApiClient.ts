import axios from "axios";
import { logout } from "@/services/auth/authService";

const privateApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ¡Muy importante! Envía cookies con cada petición.
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

privateApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, pone la petición en cola
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            return privateApiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intenta refrescar el token
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { withCredentials: true },
        );

        processQueue(null, "new-token"); // Procesa la cola con éxito
        return privateApiClient(originalRequest); // Reintenta la petición original
      } catch (refreshError) {
        processQueue(refreshError, null); // Procesa la cola con error
        // Si el refresco falla, es un logout definitivo.
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default privateApiClient;
