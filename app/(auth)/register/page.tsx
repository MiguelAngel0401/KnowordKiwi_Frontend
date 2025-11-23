"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Textarea,
  Transition,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import ErrorModal from "@/components/shared/ErrorModal";
import { debounce } from "lodash";
import { Eye, EyeOff } from "lucide-react";
import {
  checkEmail,
  checkUsername,
  registerUser,
} from "@/services/auth/authService";
import { uploadToCloudinary } from "@/services/cloudinary/cloudinaryService";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const { handleAxiosError } = useAxiosErrorHandler();

  //Estados para validacion asíncrona
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null,
  );
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    // `onTouched` valida en el primer blur para errores de formato.
    // `reValidateMode: 'onSubmit'` evita que se re-valide en cada cambio,
    // lo que previene que el error de disponibilidad que establecimos manualmente sea borrado.
    mode: "onTouched",
    reValidateMode: "onSubmit",
  });

  const email = watch("email");
  const password = watch("password");
  const username = watch("username");
  const realName = watch("realName");
  watch("bio");

  // Validar solo los campos del paso actual
  const stepFields: Record<number, (keyof RegisterFormData)[]> = {
    1: ["email", "password"],
    2: ["username", "realName"],
    3: ["bio"],
  };

  // Funcion para verificar disponibilidad de email
  const checkEmailAvailability = useCallback(
    debounce(async (email: string) => {
      if (!email) {
        setIsEmailAvailable(null);
        clearErrors("email"); // Limpiar errores si el campo está vacío
        return;
      }
      setIsEmailChecking(true);
      try {
        const response = await checkEmail(email);
        if (response.available) {
          setIsEmailAvailable(true);
          clearErrors("email");
        } else {
          setIsEmailAvailable(false);
          setError("email", {
            type: "manual",
            message: response.message,
          });
        }
      } catch (error) {
        console.error("Error al verificar el correo:", error);
        setIsEmailAvailable(false);
        setError("email", {
          type: "manual",
          message:
            "Error al verificar el correo. Inténtalo de nuevo más tarde.",
        });
      } finally {
        setIsEmailChecking(false);
      }
    }, 1000), // Esperar 500ms antes de hacer la petición
    [setError, clearErrors],
  );

  // Efecto para observar cambios en el email y disparar la validación
  useEffect(() => {
    if (step === 1) {
      checkEmailAvailability(email);
    }
    // Limpiar la función debounce si el componente se desmonta o el email cambia
    return () => checkEmailAvailability.cancel();
  }, [email, step, checkEmailAvailability]);

  // Función para verificar la disponibilidad del nombre de usuario
  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username) {
        setIsUsernameAvailable(null);
        clearErrors("username"); // Limpiar errores si el campo está vacío
        return;
      }
      setIsUsernameChecking(true);
      try {
        const response = await checkUsername(username);
        console.log(response);
        if (response.available) {
          setIsUsernameAvailable(true);
          clearErrors("username");
        } else {
          setIsUsernameAvailable(false);
          setError("username", {
            type: "manual",
            message:
              response.message || "Este nombre de usuario ya está en uso.",
          });
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
        setIsUsernameAvailable(false);
        setError("username", {
          type: "manual",
          message: "Error al verificar el nombre de usuario. Intenta de nuevo.",
        });
      } finally {
        setIsUsernameChecking(false);
      }
    }, 1000), // Debounce de 500ms
    [setError, clearErrors],
  );

  // Efecto para observar cambios en el username y disparar la validación
  useEffect(() => {
    if (step === 2) {
      checkUsernameAvailability(username);
    }
    return () => checkUsernameAvailability.cancel();
  }, [username, step, checkUsernameAvailability]);

  // Avanzar de paso solo si los campos del paso actual son válidos Y las validaciones asíncronas pasaron
  const handleNextStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);

    if (valid) {
      if (step === 1) {
        // Asegúrate de que el email esté disponible antes de avanzar
        if (isEmailAvailable === true) {
          setStep((prev) => prev + 1);
        } else if (isEmailAvailable === false) {
          // Si no está disponible, el error ya se habrá mostrado por setError
          return;
        } else {
          // Si la verificación aún está en curso, no avanzar
          // Podrías mostrar un mensaje al usuario para que espere
          setError("email", {
            type: "manual",
            message:
              "Por favor, espera mientras verificamos la disponibilidad del correo.",
          });
        }
      } else if (step === 2) {
        // Asegúrate de que el nombre de usuario esté disponible antes de avanzar
        if (isUsernameAvailable === true) {
          setStep((prev) => prev + 1);
        } else if (isUsernameAvailable === false) {
          // Si no está disponible, el error ya se habrá mostrado por setError
          return;
        } else {
          setError("username", {
            type: "manual",
            message:
              "Por favor, espera mientras verificamos la disponibilidad del nombre de usuario.",
          });
        }
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localURL = URL.createObjectURL(file);
    setAvatarPreview(localURL);
    setIsUploadingAvatar(true);
    setAvatarError(null);
    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      setValue("avatar", cloudinaryUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error("Error al subir la imagen de avatar:", error);
      setAvatarError(
        "No se pudo subir la imagen de avatar. Inténtalo de nuevo.",
      );
      setAvatarPreview(null);
      setValue("avatar", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      console.log(data);
      await registerUser(data);
      router.push("/verify-account");
    } catch (error) {
      handleAxiosError(error);
      console.error("Error en el registro:", error);
      setSubmissionError(
        "Hubo un problema al conectar con nuestros servidores. Por favor, revisa tu conexión a internet e inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={
          step === 3 ? handleSubmit(onSubmit) : (e) => e.preventDefault()
        }
      >
        <Fieldset className="space-y-6 bg-amber-50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-xl w-full mx-4 p-6 sm:p-8">
          <Legend className="text-2xl sm:text-3xl font-bold text-center font-lora text-gray-800">
            {step === 1 && "¡Bienvenido! Empecemos creando tu cuenta"}
            {step === 2 && "¿Cómo te gustaría que te conozcan?"}
            {step === 3 && "Haz que tu perfil cuente"}
          </Legend>

          {/* Paso 1 */}
          <Transition
            show={step === 1}
            enter="transition-opacity duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="space-y-4">
              <h3 className="font-light text-center mb-4 text-gray-600 text-sm sm:text-base mb-8">
                Solo necesitamos tu correo y una contraseña segura.
              </h3>
              <Field>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico
                </Label>
                <Input
                  type="email"
                  id="email"
                  autoComplete="email"
                  className={`
                    mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary text-base transition duration-150 ease-in-out
                    ${errors.email ? "border-red-500" : "border-gray-400"}
                  `}
                  {...register("email")}
                />
                {/* Mostrar VERDE solo si no hay errores (ni de Zod ni manuales) y está disponible */}
                {!isEmailChecking &&
                  !errors.email &&
                  isEmailAvailable === true &&
                  email && (
                    <p className="text-green-800 font-light text-sm mt-2">
                      Correo disponible 👍
                    </p>
                  )}
                {/* Mostrar ROJO solo si hay errores (ya sea de Zod o manuales) */}
                {errors.email && (
                  <p className="text-red-500 font-light text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary text-base transition duration-150 ease-in-out pr-8"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-1 flex items-center text-gray-500"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 font-light text-sm mt-2">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  className="bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-primary-hover disabled:opacity-50 transition duration-300"
                  disabled={
                    !email ||
                    !password ||
                    isEmailChecking ||
                    isEmailAvailable === false
                  }
                  onClick={handleNextStep}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </Transition>

          {/* Paso 2 */}
          <Transition show={step === 2}>
            <div className="space-y-4">
              <h3 className="font-light text-center mb-4 text-gray-600 text-sm sm:text-base">
                Tu nombre de usuario será visible para otros. El nombre real es
                opcional, pero puede ayudar a conectar mejor.
              </h3>
              <Field>
                <Label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre de usuario
                </Label>
                <Input
                  type="text"
                  id="username"
                  className={`
                    mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary text-base transition duration-150 ease-in-out
                    ${errors.username ? "border-red-500" : "border-gray-400"}
                  `}
                  {...register("username")}
                />
                {/* Mostrar VERDE solo si no hay errores (ni de Zod ni manuales) y está disponible */}
                {!isUsernameChecking &&
                  !errors.username &&
                  isUsernameAvailable === true &&
                  username && (
                    <p className="text-green-800 font-light text-sm mt-2">
                      Nombre de usuario disponible 👍
                    </p>
                  )}
                {/* Mostrar ROJO solo si hay errores (ya sea de Zod o manuales) */}
                {errors.username && (
                  <p className="text-red-500 font-light text-sm mt-2">
                    {errors.username.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label
                  htmlFor="realName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre real
                </Label>
                <Input
                  type="text"
                  id="realName"
                  className="mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary text-base transition duration-150 ease-in-out"
                  {...register("realName")}
                />
                {errors.realName && (
                  <p className="text-red-500 font-light text-sm mt-2">
                    {errors.realName.message}
                  </p>
                )}
              </Field>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300"
                  onClick={handlePrevStep}
                >
                  Atrás
                </Button>
                <Button
                  type="button"
                  className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary-hover disabled:opacity-50 transition duration-300"
                  disabled={
                    !username ||
                    !realName ||
                    isUsernameChecking ||
                    isUsernameAvailable === false
                  }
                  onClick={handleNextStep}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </Transition>

          {/* Paso 3 */}
          <Transition show={step === 3}>
            <div className="space-y-4">
              <h3 className="font-light text-center mb-4 text-gray-600 text-sm sm:text-base">
                Agrega una imagen y una pequeña descripción para mostrar tu
                personalidad desde el primer día.
              </h3>
              <Field>
                <Label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Imagen de perfil (Opcional)
                </Label>

                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  disabled={isUploadingAvatar}
                />

                <Button
                  type="button"
                  className="px-4 py-2 mt-2 bg-secondary text-white font-bold rounded-full hover:bg-accent-hover transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar
                    ? "Subiendo..."
                    : avatarPreview
                      ? "Cambiar foto"
                      : "Subir foto"}
                </Button>
                {avatarPreview && (
                  <div className="w-full flex justify-center mt-4">
                    <Image
                      src={avatarPreview}
                      width={64}
                      height={64}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                )}
                {avatarError && (
                  <p className="text-red-500 font-light text-sm mt-2 text-center">
                    {avatarError}
                  </p>
                )}
              </Field>
              <Field>
                <Label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción (también opcional pero recomendado 🥸)
                </Label>
                <Textarea
                  id="bio"
                  className="mt-1 block w-full border-b py-2 px-1 focus:outline-none focus:ring-0 focus:border-secondary text-base transition duration-150 ease-in-out"
                  rows={3}
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-red-500 font-light text-sm mt-2">
                    {errors.bio.message}
                  </p>
                )}
              </Field>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300"
                  onClick={handlePrevStep}
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary-hover disabled:opacity-50 transition duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Finalizar registro"}
                </Button>
              </div>
            </div>
          </Transition>

          {/* Indicador de progreso */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Paso {step} de 3
          </div>
        </Fieldset>
      </form>
      {submissionError && (
        <ErrorModal
          message={submissionError}
          onClose={() => setSubmissionError(null)}
          // handle submit envuelve el onSubmit para proveer los datos del form de nuevo
          onRetry={() => handleSubmit(onSubmit)()}
        />
      )}
    </>
  );
}
