"use client";

import { useState, useEffect, useCallback } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogById } from "@/types/posts/blog/blogById";
import { BlogPost } from "@/types/posts/blog/blog";
import Modal from "@/app/posts/blog/components/modals/BlogModal";
import {
  getBlogPostById,
  updateBlogPost,
} from "@/services/posts/blogs/blogsService";
import { questionsService } from "@/services/questions/questionsService";
import BlogPreview from "../../components/blog/BlogPreview";
import BlogHeader from "../../components/blog/CreateBlogHeader";
import Tiptap from "../../components/blog/TipTap";
import { useDebounce } from "../../hooks/useDebounce";
import { BlogPostFormData, blogPostSchema } from "../../schemas";
import { DOM_PURIFY_CONFIG } from "../../config/dom-purify.config";
import QuizSection from "../../components/quiz/QuizSection";

const sanitizeContent = (content: string) => {
  return DOMPurify.sanitize(content, DOM_PURIFY_CONFIG);
};

type SavingStatus = "idle" | "saving" | "saved";

export default function EditBlogPost() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const formMethods = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { title: "", subtitle: "", content: "" },
  });

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = formMethods;

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>("idle");
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [loading, setLoading] = useState(true);
  const [quizChanged, setQuizChanged] = useState(false);

  // Cargar datos del blog existente
  const fetchBlogPost = useCallback(async () => {
    try {
      setLoading(true);
      const data: BlogById = await getBlogPostById(id);

      // Convertir las preguntas existentes al formato correcto si existen
      const quizData =
        data.questions && data.questions.length > 0
          ? data.questions.map((q) => ({
              id: q.id,
              title: q.title,
              options: q.options,
            }))
          : undefined;

      // Establecer valores iniciales con los datos existentes
      setValue("title", data.title);
      setValue("subtitle", data.blogContent.subtitle);
      const sanitizedContent = sanitizeContent(data.blogContent.content);
      setValue("content", sanitizedContent);
      if (quizData) {
        setValue("quiz", quizData);
      }
    } catch (error) {
      console.error("Error fetching blog post for editing:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message: "No se pudo cargar el blog para editar.",
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          router.push(`/posts/blog/${id}`);
        },
      });
    } finally {
      setLoading(false);
    }
  }, [id, setValue, router]);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id, fetchBlogPost]);

  // Función para guardar el borrador
  const saveDraft = useCallback(() => {
    setSavingStatus("saving");
    // En la edición, el guardado automático puede ser el mismo que el manual
    // ya que estamos actualizando un post existente
    setTimeout(() => {
      setSavingStatus("saved");
      setTimeout(() => {
        setSavingStatus("idle");
      }, 2000);
    }, 1000);
  }, []);

  // Crear versión debounce de la función de guardado
  const debouncedSaveDraft = useDebounce(saveDraft, 1500);

  const watchedTitle = watch("title");
  const watchedContent = watch("content");
  const watchedSubtitle = watch("subtitle");

  // Efecto para guardar automáticamente cuando cambian título o contenido
  useEffect(() => {
    if (!loading) {
      debouncedSaveDraft();
    }
  }, [
    watchedTitle,
    watchedContent,
    watchedSubtitle,
    debouncedSaveDraft,
    loading,
  ]);

  const handleSave = async () => {
    saveDraft();
    setModal({
      isOpen: true,
      title: "Borrador guardado",
      message: "Tu borrador ha sido guardado temporalmente.",
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
      // If there are questions in the form, update them separately using the questions service
      if (data.quiz && data.quiz.length > 0) {
        await questionsService.updatePostQuestions(id, {
          questions: data.quiz.map((q) => ({
            id: q.id,
            title: q.title,
            options: q.options,
          })),
        });
      } else {
        // If no questions in the form, clear existing questions by sending an empty array
        await questionsService.updatePostQuestions(id, {
          questions: [],
        });
      }

      // Update the main blog post content
      const sanitizedContent = sanitizeContent(data.content);
      const blogData: Partial<BlogPost> = {
        title: data.title,
        subtitle: data.subtitle,
        content: sanitizedContent,
        // questions are now handled separately via the questions service
        // communityId no se puede cambiar en la edición
      };

      await updateBlogPost(id, blogData);

      // Reset quizChanged state since all changes have been saved
      setQuizChanged(false);

      setModal({
        isOpen: true,
        title: "Cambios guardados",
        message: "Tu blog ha sido actualizado exitosamente.",
        onConfirm: () => {
          setModal({ ...modal, isOpen: false });
          router.push(`/posts/blog/${id}`); // Redirigir a la vista del blog editado
        },
      });
    } catch (error) {
      console.error("Error al actualizar el blog:", error);
      setModal({
        isOpen: true,
        title: "¡Ups! Algo salió mal",
        message: "Tu blog no ha podido ser actualizado.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const savingStatusText = {
    saving: "Guardando cambios...",
    saved: "Cambios guardados",
  };

  return (
    <div className="flex flex-col gap-8">
      <BlogHeader
        onSubmit={handleSubmitForm(onSubmit)}
        onSave={handleSave}
        onCancel={handleCancel}
        onTogglePreview={handleTogglePreview}
        isPreviewMode={isPreviewMode}
        isEditing={true}
        quizChanged={quizChanged}
      />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center h-5">
          <label
            htmlFor="blog-title"
            className="text-sm font-medium text-gray-300"
          >
            Título del blog
          </label>
          {savingStatus !== "idle" && (
            <span className="text-xs text-gray-500">
              {savingStatusText[savingStatus]}
            </span>
          )}
          {errors.title && (
            <span className="text-xs text-error ml-2">
              {errors.title.message}
            </span>
          )}
        </div>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              id="blog-title"
              type="text"
              value={field.value}
              onChange={field.onChange}
              className={`px-4 py-3 bg-bg-gray border ${
                errors.title ? "border-red-500" : "border-gray-700"
              } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Escribe el título de tu blog..."
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center h-5">
          <label
            htmlFor="blog-subtitle"
            className="text-sm font-medium text-gray-300"
          >
            Subtítulo del blog
          </label>
          {errors.subtitle && (
            <span className="text-xs text-error ml-2">
              {errors.subtitle.message}
            </span>
          )}
        </div>
        <Controller
          name="subtitle"
          control={control}
          render={({ field }) => (
            <Input
              id="blog-subtitle"
              type="text"
              value={field.value}
              onChange={field.onChange}
              className={`px-4 py-3 bg-bg-gray border ${
                errors.subtitle ? "border-red-500" : "border-gray-700"
              } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Escribe el subtítulo atractivo para tu blog..."
            />
          )}
        />
        {errors.subtitle && (
          <p className="text-sm text-red-500 mt-1">{errors.subtitle.message}</p>
        )}
      </div>

      {isPreviewMode ? (
        <BlogPreview
          title={getValues("title")}
          content={getValues("content")}
        />
      ) : (
        <div className="relative">
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
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
      )}

      {!isPreviewMode && (
        <div>
          <QuizSection
            formMethods={formMethods}
            onQuizChange={() => setQuizChanged(true)}
          />
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        onConfirm={modal.onConfirm}
      >
        {modal.message}
      </Modal>
    </div>
  );
}
