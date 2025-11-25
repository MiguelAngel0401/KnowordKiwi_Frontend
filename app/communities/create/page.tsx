"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Switch,
} from "@headlessui/react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createCommunitySchema } from "../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadToCloudinary } from "@/services/cloudinary/cloudinaryService";
import debounce from "lodash/debounce";
import CommunitySuccessModal from "@/app/communities/components/modals/CommunitySuccessModal";
import CommunityErrorModal from "@/app/communities/components/modals/CommunityErrorModal";
import {
  createCommunity,
  getTagRecommendations,
} from "@/services/community/communityServices";

type CreateCommunityPageData = z.infer<typeof createCommunitySchema>;

export default function CreateCommunityPage() {
  const [communityId, setCommunityId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitCorrect, setIsSubmitCorrect] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const maxTags = 5;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateCommunityPageData>({
    resolver: zodResolver(createCommunitySchema),
    mode: "onTouched",
  });

  watch("name");
  watch("description");

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "avatar",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setPreview = type === "banner" ? setBannerPreview : setAvatarPreview;
    const setIsLoading =
      type === "banner" ? setIsUploadingBanner : setIsUploadingAvatar;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setIsLoading(true);
    setSubmissionError(null);

    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      setValue(type, cloudinaryUrl, { shouldValidate: true });
    } catch (error) {
      console.error(`Error al subir la imagen de ${type}:`, error);
      setSubmissionError(
        `No se pudo subir la imagen de ${type}. Inténtalo de nuevo.`,
      );
      setPreview(null);
      setValue(type, undefined, { shouldValidate: true });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTagSuggestions = useCallback(
    debounce(async (query: string) => {
      setTagError(null);
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await getTagRecommendations(query);
        const newSuggestions = response
          .filter((s) => !selectedTags.includes(s.name.toLowerCase()))
          .map((s) => s.name);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error("Error fetching tag suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000),
    [selectedTags],
  );

  useEffect(() => {
    fetchTagSuggestions(inputValue);
    return () => {
      fetchTagSuggestions.cancel();
    };
  }, [inputValue, fetchTagSuggestions]);

  const handleAddTag = (tag: string) => {
    const newTag = tag.trim().toLowerCase();
    if (
      newTag &&
      !selectedTags.includes(newTag) &&
      selectedTags.length < maxTags
    ) {
      setSelectedTags((prev) => [...prev, newTag]);
      setInputValue("");
      setSuggestions([]);
    } else if (selectedTags.includes(newTag)) {
      setTagError("Esta etiqueta ya ha sido agregada.");
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  }

  function handleTagRemove(tagToRemove: string) {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
  }

  const handleCloseSuccessModal = () => setIsSubmitCorrect(false);

  const handleCloseErrorModal = () => {
    setSubmissionError(null);
    setIsSubmitting(false);
  };

  async function submitCreateCommunityForm(data: CreateCommunityPageData) {
    setIsSubmitting(true);
    setSubmissionError(null);
    const communityData = { ...data, isPrivate, tags: selectedTags };
    console.log(communityData);
    try {
      const response = await createCommunity(communityData);
      console.log("Comunidad creada:", response);
      setIsSubmitCorrect(true);
      setCommunityId(response.id);
    } catch (error) {
      console.error("Error al crear la comunidad:", error);
      setSubmissionError(
        "Error al crear la comunidad. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-text-color">
        Crear Comunidad
      </h1>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(submitCreateCommunityForm)}
      >
        {/* Información de la comunidad */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6 w-5/6 mx-auto">
          <Legend className="text-lg font-semibold text-text-color mb-1">
            Información de la comunidad
          </Legend>
          <p className="text-sm text-gray-600 mb-6">
            Estamos emocionados de ver tu comunidad cobrar vida. Cuéntanos un
            poco de lo que tienes en mente.
          </p>

          <Field className="mb-6">
            <Label className="block text-sm font-medium mb-1 text-text-color">
              Título de la comunidad
            </Label>
            <Input
              type="text"
              placeholder="Ej. Matemáticas y física"
              className={`w-full px-4 py-2 rounded-lg bg-green-100 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 ${errors.name ? "border-text-error focus:border-text-error focus:ring-red-500" : "border-gray-300 focus:ring-secondary focus:border-secondary"}`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </Field>

          <Field className="mb-6">
            <Label className="block text-sm font-medium mb-1 text-text-color">
              Descripción de la comunidad
            </Label>
            <Input
              type="text"
              placeholder="Ej. Un lugar para discutir y aprender sobre matemáticas y física."
              className={`w-full px-4 py-2 rounded-lg bg-green-100 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 ${errors.description ? "border-text-error focus:border-text-error focus:ring-red-500" : "border-gray-300 focus:ring-secondary focus:border-secondary"}`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-error text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </Field>
          <Field className="mb-6">
            <Label className="block text-sm font-medium mb-1 text-text-color">
              Privacidad de la comunidad.
            </Label>
            <Switch
              checked={isPrivate}
              onChange={setIsPrivate}
              className="group inline-flex h-6 w-11 mt-2 items-center rounded-full bg-gray-700 transition data-checked:bg-secondary"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
            </Switch>
            <div className="mt-2 text-sm font-medium text-white">
              {isPrivate && (
                <p className="text-sm text-text-error">
                  La comunidad será privada, solo podrás invitar a miembros
                  mediante un enlace de confirmación
                </p>
              )}
              <p className="text-sm text-gray-600">
                {!isPrivate &&
                  "La comunidad será pública, es decir que cualquiera puede unirse y ver su contenido."}
              </p>
            </div>
          </Field>
        </Fieldset>

        {/* Etiquetas */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6 w-5/6 mx-auto">
          <Legend className="text-lg font-semibold text-text-color mb-1">
            Temas de la comunidad
          </Legend>
          <p className="text-sm text-gray-600 mb-4">
            Añade al menos 3 etiquetas para que los demás puedan encontrar tu
            comunidad fácilmente.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="animate-rainbow-bg text-white px-6 py-3 rounded-md flex items-center text-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-105"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-3 text-red-300 hover:text-red-100 text-2xl font-bold focus:outline-none"
                  aria-label={`Remove ${tag}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {selectedTags.length < maxTags && (
            <div>
              <Input
                type="text"
                placeholder="Ej. programación"
                className="w-50 rounded px-3 py-2 text-sm bg-green-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {isSearching && (
                <p className="text-sm text-gray-400 italic flex items-center gap-2 mt-2">
                  <span className="animate-pulse">🔍</span>
                  Buscando...
                </p>
              )}
              {suggestions.length > 0 && !isSearching && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleAddTag(suggestion)}
                      className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTags.length >= maxTags && (
            <p className="text-sm text-gray-600 mt-2">
              Has agregado el máximo de {maxTags} etiquetas.
            </p>
          )}
          {tagError && (
            <p className="text-text-error text-sm mt-2">{tagError}</p>
          )}
        </Fieldset>

        {/* Imágenes */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6 w-5/6 mx-auto">
          <Legend className="text-lg font-semibold text-text-color mb-1">
            Imágenes de la comunidad
          </Legend>
          <p className="text-sm text-gray-600 mb-6">
            Añade un banner y un avatar representativo para que tu comunidad se
            vea única.
          </p>

          <div className="space-y-6">
            {/* Banner */}
            <label className="block border border-dashed border-zinc-600 rounded-lg p-6 cursor-pointer hover:border-white transition text-center relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "banner")}
                disabled={isUploadingBanner}
              />
              {isUploadingBanner && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              {bannerPreview ? (
                <Image
                  src={bannerPreview}
                  width={1840}
                  height={560}
                  alt="Previsualización de la cabecera"
                  className="w-full max-h-48 object-cover rounded-md"
                />
              ) : (
                !isUploadingBanner && (
                  <>
                    <strong className="block text-text-color mb-1">
                      Sube la cabecera
                    </strong>
                    <p className="text-sm text-zinc-900">
                      Pulsa aquí para elegir una imagen. Debe tener un tamaño de
                      1840 x 560 píxeles.
                    </p>
                  </>
                )
              )}
            </label>

            {/* Avatar */}
            <label className="flex items-center gap-4 cursor-pointer group transition">
              <div className="w-20 h-20 border border-dashed border-zinc-600 rounded-lg flex items-center justify-center bg-gray-800 relative">
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
                {avatarPreview && !isUploadingAvatar ? (
                  <Image
                    src={avatarPreview}
                    width={512}
                    height={512}
                    alt="Previsualización del avatar"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  !isUploadingAvatar && (
                    <ImageIcon className="text-zinc-400 w-6 h-6" />
                  )
                )}
              </div>

              <div className="flex flex-col">
                <strong className="text-sm text-text-color mb-1">
                  Sube un avatar
                </strong>
                <p className="text-sm text-zinc-900">
                  El formato ideal es cuadrado con un tamaño de 512 píxeles.
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "avatar")}
                disabled={isUploadingAvatar}
              />
            </label>
          </div>
        </Fieldset>
        {/* Botón de creación */}
        <div className="flex mt-6 justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-hover transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              isUploadingBanner ||
              isUploadingAvatar ||
              !isValid ||
              selectedTags.length < 3
            }
            onClick={() => {
              setIsSubmitting(true);
            }}
          >
            {isSubmitting ? "Creando..." : "Crear Comunidad"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/communities")}
            className="px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition duration-300 ml-4"
          >
            Cancelar
          </button>
        </div>
      </form>
      {/* Modal de éxito o error */}
      <CommunitySuccessModal
        isOpen={isSubmitCorrect}
        onClose={handleCloseSuccessModal}
        message=" Tu comunidad se ha creado con éxito. Comparte tu conocimiento con el mundo."
        communityId={communityId}
      />
      <CommunityErrorModal
        isOpen={!!submissionError}
        onClose={handleCloseErrorModal}
        message={submissionError || undefined}
      />
    </div>
  );
}
