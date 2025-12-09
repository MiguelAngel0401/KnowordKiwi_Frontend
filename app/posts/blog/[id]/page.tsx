"use client";

import { useState, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle, Heart, User, Edit3, Trash2 } from "lucide-react";
import {
  getBlogPostById,
  deleteBlogPost,
} from "@/services/posts/blogs/blogsService";
import { BlogById } from "@/types/posts/blog/blogById";
import QuizComponent from "../components/quiz/QuizComponent";
import QuizModal from "@/app/posts/blog/components/modals/QuizModal";
import Modal from "@/app/posts/blog/components/modals/BlogModal";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blogPost, setBlogPost] = useState<BlogById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPostById(Number(id));
        setBlogPost(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("No se pudo cargar el contenido del blog.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="text-center py-8">
        <p className="text-text-color">Blog no encontrado.</p>
      </div>
    );
  }

  // Para esta implementación, asumiremos que el usuario actual es el autor
  // En una implementación real, esto se verificaría con el ID del usuario actual
  const currentUserIsAuthor = true; // TODO: Implementar verificación real de autoría

  const handleEdit = () => {
    router.push(`/posts/blog/edit/${id}`);
  };

  const confirmDelete = () => {
    setModal({
      isOpen: true,
      title: "Eliminar blog",
      message: `¿Estás seguro de que deseas eliminar "${blogPost.title}"? Esta acción no se puede deshacer.`,
      onConfirm: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteBlogPost(Number(id));
      setModal({
        ...modal,
        isOpen: false,
      });
      router.push("/profile/me");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setModal({
        ...modal,
        isOpen: false,
      });
      // Mostrar un mensaje de error si falla la eliminación
      setModal({
        isOpen: true,
        title: "Error",
        message: "No se pudo eliminar el blog. Por favor, inténtalo de nuevo.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          {/* Implementar avatar de autor */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
            <User className="text-gray-300 w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-text-color">
              {blogPost.author.user.username}
            </h3>
            <p className="text-sm text-gray-600">Hace 5 días</p>{" "}
            {/* You may want to implement a proper time
   ago function */}
          </div>

          {currentUserIsAuthor && (
            <>
              <button
                onClick={handleEdit}
                className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-hover transition-colors font-bold"
              >
                <Edit3 size={16} />
                Editar
              </button>
              <button
                onClick={confirmDelete}
                className="font-bold ml-2 flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold text-text-color mb-4">
          {blogPost.title}
        </h1>

        <p className="text-xl text-gray-800 mb-6">
          {blogPost.blogContent.subtitle}
        </p>

        <div className="flex items-center text-gray-600 text-sm">
          <span className="mr-4">Compartir</span>
          <div className="flex items-center mr-4">
            <Heart size={18} className="mr-1" />
            {/* <span>{blogPost.reactions || 0}</span> */}
          </div>
          <div className="flex items-center mr-4">
            <MessageCircle size={18} className="mr-1" />
            {/* <span>{blogPost.comments || 0}</span> */}
          </div>

          {/* Quiz Indicator */}
          {blogPost.questions && blogPost.questions.length > 0 && (
            <div className="flex items-center text-terciary">
              <div className="w-3 h-3 rounded-full bg-terciary mr-2 animate-pulse"></div>
              <span className="text-sm">Quiz disponible</span>
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-invert max-w-none text-text-color">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blogPost.blogContent.content, {
              ALLOWED_TAGS: [
                "p",
                "br",
                "strong",
                "em",
                "u",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "li",
                "blockquote",
                "hr",
                "div",
                "pre",
                "code",
                "span",
                "figure",
                "figcaption",
                "table",
                "thead",
                "tbody",
                "tr",
                "th",
                "td",
                "a",
                "img",
                "iframe",
                "youtube",
              ],
              ALLOWED_ATTR: [
                "href",
                "src",
                "alt",
                "title",
                "class",
                "id",
                "style",
                "width",
                "height",
                "target",
                "rel",
                "controls",
                "allowfullscreen",
                "frameborder",
                "data-youtube-video",
              ],
              ALLOWED_IFRAME_HOSTNAMES: [
                "www.youtube.com",
                "youtube.com",
                "youtu.be",
                "player.vimeo.com",
              ],
            }),
          }}
        />
      </div>

      {/* Quiz Button - Only show if the blog has questions */}
      {blogPost.questions && blogPost.questions.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setQuizModalOpen(true)}
            className="py-2 px-4 bg-secondary hover:bg-secondary-hover text-white rounded-lg font-bold text-sm"
          >
            Abrir Test de Conocimiento
          </button>
        </div>
      )}

      {/* Quiz Modal - Only show if the blog has questions */}
      {blogPost.questions && blogPost.questions.length > 0 && quizModalOpen && (
        <QuizModal
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          title="Test de Conocimiento"
          showConfirmButton={false}
        >
          <QuizComponent questions={blogPost.questions} />
        </QuizModal>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        onConfirm={modal.onConfirm}
      >
        {modal.message}
      </Modal>
    </article>
  );
}
