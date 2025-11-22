"use client";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { confirmEmail } from "@/services/auth/authService";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, message, setStatus, setMessage, handleAxiosError } =
    useAxiosErrorHandler();

  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (hasVerified.current || !token) {
      if (!token && status === "loading") {
        setStatus("error");
        setMessage("Token de verificación no proporcionado.");
      }
      return;
    }

    // Marca que la verificación (es decir, ya hay token) ha comenzado para prevenir ejecucciones futuras
    hasVerified.current = true;

    const verifyAccount = async () => {
      setStatus("loading");
      setMessage("Verificando tu cuenta...");

      try {
        const response = await confirmEmail(token);
        console.log("respuesta dentro del componente" + response);
        setStatus("success");
        setMessage(response.message || "Cuenta verificada exitosamente.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    verifyAccount();
  }, [searchParams, handleAxiosError, setStatus, setMessage, router, status]);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-center text-white">
      {status === "loading" && (
        <>
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            {message}
          </h2>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="mt-4 text-gray-100">Por favor, espera un momento...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="text-primary text-6xl mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">{message}</h1>
          <p className="text-gray-100 mb-6">
            Serás redirigido a la página de inicio de sesión en breve.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Ir a Iniciar Sesión
          </button>
        </>
      )}
      {status === "error" && (
        <>
          <div className="text-text-error text-6xl mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-error mb-4">
            Error de Verificación
          </h1>
          <p className="text-gray-100 mb-6">
            {message}. Vuelve a generar un enlace de verificación.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-error hover:bg-error-hover text-gray-100 font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Volver a Inicio
          </button>
        </>
      )}
    </div>
  );
}
