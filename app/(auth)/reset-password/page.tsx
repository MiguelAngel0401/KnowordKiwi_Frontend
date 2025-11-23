"use client";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schemas";
import { useRouter } from "next/navigation";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import publicApiClient from "@/services/client/publicApiClient";
import axios from "axios";
import ErrorModal from "@/components/shared/ErrorModal";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");
  const router = useRouter();
  const [areParamsValid, setAreParamsValid] = useState(false);

  const {
    register,
    watch,
    trigger,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const { handleAxiosError } = useAxiosErrorHandler();

  useEffect(() => {
    if (!uid && !token) {
      console.error("uid o token no encontrados en la URL");
      setBackendError(
        "Parece que tu enlace no es valido. Por favor, solicita un nuevo enlace.",
      );
      setAreParamsValid(false);
    } else {
      setAreParamsValid(true);
    }
  }, [uid, token, router]);

  useEffect(() => {
    if (password !== confirmPassword) {
      trigger("confirmPassword");
    } else {
      clearErrors("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!uid || !token) {
      setBackendError(
        "Parece que tu enlace no es valido. Por favor, solicita un nuevo enlace.",
      );
      return;
    }
    setIsSubmitting(true);
    setBackendError(null);
    setSubmissionError(null);
    setShowErrorModal(false);

    try {
      await publicApiClient.post(
        "http://localhost:8000/api/password-reset/confirm/",
        {
          password: data.password,
          uid: uid,
          token: token,
        },
      );
      console.log("Contraseña restablecida con éxito.");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setBackendError(error.response.data.error);
      } else {
        handleAxiosError(error);
        setSubmissionError(
          "Hubo un problema al conectar con nuestros servidores. Por favor, reintenta de nuevo.",
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
    onSubmit(getValues()); // Reintentar el envío del formulario con los valores actuales
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset className="space-y-8 bg-bg-gray rounded-lg shadow-lg max-w-lg p-8 mx-auto my-12">
        <Legend className="text-3xl font-bold text-center mb-12" as="h2">
          Crea una nueva contraseña
        </Legend>

        <Field>
          <Label className="block text-sm font-medium">Nueva contraseña</Label>
          <Input
            type="password"
            autoComplete="new-password"
            required
            className={`mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary sm:text-sm transition duration-150 ease-in-out ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 font-light text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </Field>

        <Field>
          <Label className="block text-sm font-medium">
            Confirmar contraseña
          </Label>
          <Input
            type="password"
            autoComplete="new-password"
            required
            className={`mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary sm:text-sm transition duration-150 ease-in-out ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 font-light text-sm mt-2">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>
        {backendError && ( // Mostrar el error del backend si existe
          <p className="text-text-error font-medium text-sm text-center mt-2">
            {backendError}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-hover mt-6 transition duration-300"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar nueva contraseña"}
        </Button>
      </Fieldset>
      {showErrorModal && submissionError && (
        <ErrorModal
          message={submissionError}
          onClose={handleCloseErrorModal}
          onRetry={handleRetryConnection}
        />
      )}
    </form>
  );
}
