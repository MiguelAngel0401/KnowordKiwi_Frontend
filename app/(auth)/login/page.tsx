"use client";

import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import ErrorModal from "@/components/shared/ErrorModal";
import InfoModal from "@/components/shared/InfoModal";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/auth/authService";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
    getValues, //añadir getValues para reintentar el inicio de sesión con los datos actuales (dentro del modal de error)
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  watch("email");
  watch("password");

  const { handleAxiosError } = useAxiosErrorHandler();

  useEffect(() => {
    // Si el usuario ya está autenticado, no debería estar en la página de login.
    // Lo redirigimos a su perfil. Usamos replace para no ensuciar el historial.
    if (isAuthenticated) {
      router.replace("/profile/me");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const reason = searchParams.get("reason");
    const from = searchParams.get("from");
    // Solo mostramos el modal si la razón es 'unauthorized' Y el usuario NO está autenticado.
    if (reason === "unauthorized" && from && !isAuthenticated) {
      setInfoModalMessage(
        `Para acceder a todo el contenido de Knoword, primero debes iniciar sesión.`,
      );
      setShowInfoModal(true);
    }
  }, [searchParams, isAuthenticated]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setBackendError(null); // Limpiar errores previos del backend
    setSubmissionError(null); // Limpiar errores de envío previos
    setShowErrorModal(false); // Cerrar modal de error si estaba abierto

    try {
      await login(data);

      // Si login() es exitoso (no lanza error), las cookies ya están seteadas.
      setIsAuthenticated(true);
      router.push("/profile/me");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setBackendError(error.response.data.message);
        setError("email", { type: "manual" });
        setError("password", { type: "manual" });
      } else {
        // Error de red u otro problema
        handleAxiosError(error);
        setSubmissionError(
          "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.",
        );
        setShowErrorModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setSubmissionError(null);
  };

  const handleRetryConnection = () => {
    setShowErrorModal(false);
    onSubmit(getValues()); // Reintentar el envio del formulario con los valores actuales
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset className="space-y-8 bg-bg-gray rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-2xl p-8">
        <Legend className="text-3xl font-bold text-center font-lora text-gray-800">
          ¿Listo para aprender algo nuevo hoy?
        </Legend>
        <Field>
          <h3 className="font-light text-center mb-10 text-gray-600">
            Aprende, comparte y crece junto a una comunidad que ama el
            conocimiento.
          </h3>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </Label>
          <Input
            type="email"
            autoComplete="email"
            required
            className={`mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary sm:text-sm transition duration-150 ease-in-out ${
              errors.email ? "border-red-500" : "border-gray-400"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 font-light text-md mt-2">
              {errors.email.message}
            </p>
          )}
        </Field>
        <Field>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </Label>
          <Input
            type="password"
            autoComplete="current-password"
            required
            className={`mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary sm:text-sm transition duration-150 ease-in-out ${
              errors.password ? "border-red-500" : "border-gray-400"
            }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 font-light text-md mt-2">
              {errors.password.message}
            </p>
          )}
        </Field>
        {backendError && ( //Mostrar error del backend si existe
          <p className="text-text-error font-medium text-md text-center">
            {backendError}
          </p>
        )}
        <div className="flex justify-center items-center mt-2">
          <span className="text-gray-600 mr-1">¿Olvidaste tu contraseña?</span>
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary-hover transition duration-150 ease-in-out font-medium"
          >
            Recupérala en segundos.
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-primary-hover mt-6 transition duration-300 disabled:opacity-50"
          disabled={isSubmitting} //Deshabilitar el botón mientras se envía
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </Fieldset>
      {showErrorModal && submissionError && (
        <ErrorModal
          message={submissionError}
          onClose={handleCloseErrorModal}
          onRetry={handleRetryConnection}
        />
      )}
      {showInfoModal && (
        <InfoModal
          isOpen={showInfoModal}
          message={infoModalMessage}
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </form>
  );
}
