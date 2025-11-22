import { useState } from "react";
import axios from "axios";

export function useAxiosErrorHandler() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [message, setMessage] = useState<string>("");

  function handleAxiosError(error: unknown) {
    setStatus("error");

    if (axios.isAxiosError(error)) {
      const apiMessage =
        error.response?.data?.message || "Ocurrió un error inesperado.";
      setMessage(apiMessage);
    } else {
      setMessage("Error desconocido.");
    }
  }

  return { status, message, setStatus, setMessage, handleAxiosError };
}
