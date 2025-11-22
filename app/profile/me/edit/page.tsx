"use client";
import { useState, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Avatar } from "@/components/ui/userProfile/Avatar";
import { Pencil } from "lucide-react";
import { profileSchema } from "../../schemas";
import { uploadToCloudinary } from "@/services/cloudinary/cloudinaryService";
import { getMe, updateUserData } from "@/services/users/userServices";
import { User } from "@/types/users/user";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditor() {
  const [loading, setLoading] = useState(false);
  const [errorFetchingProfile, setErrorFetchingProfile] = useState<
    string | null
  >(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Para abrir o cerrar el modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, // isDirty para verificar si hay cambios en el formulario
    setValue,
    getValues,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getMe();
        setUser(response.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorFetchingProfile(
          "No pudimos cargar tu perfil. Inténtalo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    // Cuando los datos del usuario se cargan, actualizamos los valores del formulario.
    if (user) {
      reset({
        realName: user.realName || "",
        email: user.email || "",
        username: user.username || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, reset]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleEditClick = () => {
    if (isEditing) {
      if (user) {
        reset({
          realName: user.realName || "",
          email: user.email || "",
          username: user.username || "",
          bio: user.bio || "",
          avatar: user.avatar || "",
        });
        setAvatarPreview(user.avatar || null);
        setSubmissionError(null);
      }
    }
    setIsEditing((prev) => !prev);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleImageUpload called");
    const file = e.target.files?.[0];
    if (!file) return;

    const localURL = URL.createObjectURL(file);
    setAvatarPreview(localURL);
    setIsUploadingAvatar(true);
    setSubmissionError(null);
    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      setValue("avatar", cloudinaryUrl, {
        shouldValidate: true,
        shouldDirty: true, // Hara que el campo se incluya en la validacion de isDirty
      });
    } catch (error) {
      console.error("Error al subir la imagen de avatar:", error);
      setSubmissionError(
        "No se pudo subir la imagen de avatar. Inténtalo de nuevo.",
      );
      setAvatarPreview(user?.avatar || null);
      setValue("avatar", user?.avatar ?? undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    const updatedData = {
      ...data,
      avatar: getValues("avatar"),
    };
    try {
      const response = await updateUserData(updatedData);
      setUser(response.user);
      setIsEditing(false); // Salir del modo edición
      openModal();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setSubmissionError(
        "No se pudo actualizar el perfil. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorFetchingProfile) {
    return <ErrorMessageScreen error={errorFetchingProfile} />;
  }

  return (
    <div className="min-h-screen w-full p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-6">Editar Perfil</h1>

      {/* Seccion de foto de perfil */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-200 mb-6">
        <Avatar
          src={avatarPreview || "/default-avatar.jpeg"}
          size="lg"
          editable={isEditing}
        />
        {isEditing && (
          <div className="flex flex-col items-center justify-center sm:items-start ml-4">
            <label
              htmlFor="avatar-upload"
              className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors duration-200 cursor-pointer"
            >
              {isUploadingAvatar ? "Subiendo..." : "Subir nueva imagen"}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploadingAvatar}
              />
            </label>
            {submissionError && (
              <p className="text-red-500 mt-2">{submissionError}</p>
            )}
            <p className="text-gray-400 text-xs mt-4 text-center sm:text-left">
              Recomendamos una imagen de al menos 800×800 pixeles. <br />
              Asegurate que el formato de la imagen sea JPG o PNG
            </p>
          </div>
        )}
      </div>

      {/* Seccion de informacion personal */}
      <form className="space-y-20" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Informacion Personal</h2>
          <button
            type="button" // Prevent form submission
            onClick={handleEditClick}
            className={`flex items-center  font-medium text-sm transition-colors duration-200 ${isEditing ? "text-error hover:text-error-hover" : "text-primary hover:text-primary-hover"}`}
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-8">
          <div>
            <label
              htmlFor="realName"
              className="block text-gray-400 text-sm mb-2"
            >
              Nombre Completo
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="realName"
                  {...register("realName")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.realName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.realName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.realName.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{user?.realName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm mb-2">
              Correo Electronico
            </label>
            {isEditing ? (
              <>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{user?.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-400 text-sm mb-2">
              Nombre de usuario
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{user?.username}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Biografia</h2>
        </div>
        <div>
          {isEditing ? (
            <>
              <textarea
                id="bio"
                {...register("bio")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              />
            </>
          ) : (
            <p className="font-medium">{user?.bio}</p>
          )}
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit" // This button submits the form
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !isDirty || isSubmitting || Object.keys(errors).length > 0
              } // Disable if no changes or validation errors
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        )}
      </form>

      {/* Headless UI Modal para confirmacion de edicion */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Perfil Actualizado Con Exito 🎉
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">
                      Tu informacion de perfil se ha actualizado correctamente.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Entendido, gracias
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
