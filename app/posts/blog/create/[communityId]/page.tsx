"use client";
import { useState, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogPost } from "@/types/posts/blog";
import { createBlogPost } from "@/services/posts/blogs/blogsService";
import {
  blogPostSchema,
  type BlogPostFormData,
} from "@/app/posts/blog/schemas";
import { DOM_PURIFY_CONFIG } from "../../config/dom-purify.config";
import { useBlogDraft } from "../../hooks/useBlogDraft";
import BlogHeader from "../../components/blog/CreateBlogHeader";
import BlogPreview from "../../components/blog/BlogPreview";
import Tiptap from "../../components/blog/TipTap";
import BlogModal from "../../components/modals/BlogModal";
import FormInput from "../../components/blog/FormInput";
import QuizSection from "../../components/quiz/QuizSection";
import BlogDraftCofirmationModal from "../../components/modals/BlogDraftConfirmationModal";

const sanitizeContent = (content: string) => {
  return DOMPurify.sanitize(content, DOM_PURIFY_CONFIG);
};

export default function CreateBlogPost() {
  const params = useParams();
  const communityId = Number(params.communityId);
  const router = useRouter();

  const formMethods = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { title: "", subtitle: "", content: "" },
  });

  const {
    control,
    handleSubmit: handleSubmitForm,
    getValues,
    setValue,
    formState,
  } = formMethods;

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { savingStatus, saveDraft, loadedDraft } = useBlogDraft(formMethods);

  // Este efecto se ejecutará cuando el hook useBlogDraft cargue un borrador válido.
  useEffect(() => {
    if (loadedDraft) {
      setIsDraftModalOpen(true);
    }
  }, [loadedDraft]);

  const handleSave = async () => {
    saveDraft();
    setModal({
      isOpen: true,
      title: "Borrador guardado",
      message:
        "Tu borrador ha sido guardado exitosamente en el almacenamiento local.",
      onConfirm: () => setModal({ ...modal, isOpen: false }),
    });
  };

  const handleCancel = () => {
    // Preguntar al usuario si desea descartar cambios
    setModal({
      isOpen: true,
      title: "¿Estás seguro?",
      message: "Si sales ahora, perderás los cambios no guardados.",
      onConfirm: () => {
        setModal({ ...modal, isOpen: false });
        router.back();
      },
    });
  };

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      const sanitizedContent = sanitizeContent(data.content);
      const blogData: BlogPost = {
        title: data.title,
        subtitle: data.subtitle,
        content: sanitizedContent,
        communityId: communityId,
        questions:
          data.quiz?.map((q) => ({
            id: q.id,
            title: q.title,
            options: q.options,
          })) || [],
      };

      const response = await createBlogPost(blogData);
      const blogTitle = response.title || "Tu blog";
      localStorage.removeItem("blogDraft");

      setModal({
        isOpen: true,
        title: "Contenido publicado",
        message: `${blogTitle} ha sido publicado exitosamente en la comunidad.`,
        onConfirm: () => {
          setModal({ ...modal, isOpen: false });
          router.push(`/communities/community/${communityId}`); // Redirigir a la comunidad
        },
      });
    } catch (error) {
      console.error("Error al crear el blog:", error);
      setModal({
        isOpen: true,
        title: "¡Ups! Algo salió mal",
        message: "Tu blog no ha podido ser publicado en la comunidad.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const savingStatusText = {
    saving: "Guardando...",
    saved: "Guardado",
  };

  return (
    <div className="flex flex-col gap-8">
      <BlogHeader
        onSubmit={handleSubmitForm(onSubmit)}
        onSave={handleSave}
        onCancel={handleCancel}
        onTogglePreview={handleTogglePreview}
        isPreviewMode={isPreviewMode}
        isEditing={false}
        quizChanged={false}
      />
      <FormInput
        name="title"
        label="Título del blog"
        control={control}
        formState={formState}
        placeholder="Escribe el título de tu blog..."
        savingStatus={savingStatus}
        savingStatusText={savingStatusText}
      />

      <FormInput
        name="subtitle"
        label="Subtítulo del blog"
        control={control}
        formState={formState}
        placeholder="Escribe el subtítulo atractivo para tu blog..."
      />

      {isPreviewMode ? (
        <BlogPreview
          title={getValues("title")}
          subtitle={getValues("subtitle")}
          content={getValues("content")}
        />
      ) : (
        <>
          <div className="relative">
            <p className="text-sm text-gray-600 mb-2">Contenido</p>
            <Controller
              name="content"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Tiptap
                  content={value}
                  onChange={(newContent) => {
                    onChange(newContent);
                    // Actualizar el contenido en el formulario
                    setValue("content", newContent, { shouldValidate: true });
                  }}
                />
              )}
            />
            {formState.errors.content && (
              <p className="text-sm text-red-400 mt-1">
                {formState.errors.content.message}
              </p>
            )}
          </div>
          <div>
            <QuizSection formMethods={formMethods} />
          </div>
        </>
      )}

      <BlogModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        onConfirm={modal.onConfirm}
      >
        {modal.message}
      </BlogModal>

      <BlogDraftCofirmationModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        title="Borrador encontrado"
        confirmText="Cargar borrador"
        onConfirm={() => {
          // El borrador ya fue cargado por el hook useBlogDraft, solo cerramos el modal.
          setIsDraftModalOpen(false);
        }}
        cancelText="Crear nuevo post"
        onCancel={() => {
          // Limpiamos el localStorage y reseteamos el formulario junto con el quiz.
          localStorage.removeItem("blogDraft");
          formMethods.reset({
            title: "",
            subtitle: "",
            content: "",
            quiz: undefined,
          });
          setIsDraftModalOpen(false);
        }}
      >
        <div>
          <div className="mb-4">
            Hemos encontrado un borrador guardado. ¿Deseas continuar editándolo
            o prefieres empezar un nuevo post desde cero?
          </div>
          {loadedDraft && (
            <div className="p-3 bg-bg-gray border border-gray-600 rounded-lg text-sm">
              <div className="font-bold text-text-color truncate">
                {loadedDraft.title}
              </div>
              <div className="text-gray-800 truncate">
                {loadedDraft.subtitle}
              </div>
            </div>
          )}
        </div>
      </BlogDraftCofirmationModal>
    </div>
  );
}
