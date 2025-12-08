import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogPostFormData } from "@/app/posts/blog/schemas";
import QuizModal from "../modals/QuizModal";
import BlogPreview from "../blog/BlogPreview";
import QuizQuestionCreator from "./QuizQuestionCreator";
import QuizDisplay from "./QuizDisplay";
import ViewModeToggler, { ViewMode } from "./ViewModeToggler";
import { Question } from "@/types/posts/quiz/question";
import { Lock, Sparkles, Edit3 } from "lucide-react";
import { aiQuizService } from "@/services/ai-quiz/aiQuizService";

interface QuizCreatorProps {
  formMethods: UseFormReturn<BlogPostFormData>;
  postId?: number; // Post ID for AI generation
  onQuizChange?: () => void;
}

// Tooltip component for disabled state
const Tooltip = ({
  children,
  content,
  isVisible,
}: {
  children: React.ReactNode;
  content: string;
  isVisible: boolean;
}) => {
  return (
    <div className="relative inline-block">
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 px-3 py-2 bg-[#f5f5dc] text-[#2c2a29] text-sm rounded-lg shadow-lg z-10 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#f5f5dc]"></div>
        </div>
      )}
    </div>
  );
};

export default function QuizSection({
  formMethods,
  postId,
  onQuizChange,
}: QuizCreatorProps) {
  const { watch, setValue } = formMethods;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>("quiz");
  const [selectedCount, setSelectedCount] = useState<number>(5); // Default to 5 questions

  const savedQuiz = watch("quiz");
  const hasSavedQuiz = Array.isArray(savedQuiz) && savedQuiz.length > 0;

  // Reset isEditingQuiz state when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setIsEditingQuiz(false);
    }
  }, [isModalOpen]);

  const handlePreview = () => {
    if (activeView === "blog") {
      const { title, subtitle, content } = formMethods.getValues();
      return (
        <BlogPreview title={title} subtitle={subtitle} content={content} />
      );
    } else if (activeView === "quiz") {
      if (hasSavedQuiz && !isEditingQuiz) {
        return (
          <QuizDisplay
            questions={savedQuiz}
            onEdit={() => setIsEditingQuiz(true)}
          />
        );
      } else if (isEditingQuiz) {
        return (
          <QuizQuestionCreator
            initialQuestions={savedQuiz}
            onSave={handleOnSave}
          />
        );
      } else {
        return (
          <QuizQuestionCreator
            initialQuestions={savedQuiz}
            onSave={handleOnSave}
          />
        );
      }
    }
    return null;
  };

  const handleOnSave = (questions?: Question[]) => {
    if (questions && questions.length > 0) {
      setValue("quiz", questions);
    } else {
      setValue("quiz", undefined); // Si no hay preguntas, limpiamos el campo
    }
    setIsEditingQuiz(false); // Salir del modo edición al guardar
    // No cerramos el modal para que el usuario vea el quiz guardado.
    // Notify parent that quiz has been changed
    if (onQuizChange) {
      onQuizChange();
    }
  };

  const handleShowSavedQuiz = () => {
    setIsModalOpen(true);
  };

  const handleManualCreate = () => {
    setIsModalOpen(true);
  };

  const handleAIGenerate = async () => {
    if (!postId) return; // Don't proceed if no postId

    try {
      const response = await aiQuizService.generateQuiz(postId, selectedCount);
      const questions = response.questions;

      if (questions.length === 0) {
        // Handle case where no questions were generated
        console.error("No questions generated");
        return;
      }

      // Update the form with the generated questions
      setValue("quiz", questions);

      // Open the modal to show the generated quiz
      setIsModalOpen(true);

      // Notify parent that quiz has been changed
      if (onQuizChange) {
        onQuizChange();
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      // In a real app, you might want to show an error message to the user
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {hasSavedQuiz ? (
            <>
              <span className="text-lg">Quiz guardado en el borrador</span>
              <button
                onClick={handleShowSavedQuiz}
                className="text-blue-500 hover:text-blue-400 underline text-lg"
              >
                Ver quiz
              </button>
            </>
          ) : (
            <>
              <span className="text-lg">
                ¿Deseas añadir un quiz a tu publicación?
              </span>
            </>
          )}
        </div>

        {!hasSavedQuiz && (
          <div className="flex flex-col mt-12 md:flex-row gap-6">
            {/* AI Generation Card */}
            <Tooltip
              content="Publica tu apunte primero para que la IA pueda leerlo"
              isVisible={!postId}
            >
              <div
                className={`relative flex-1 rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer
                  ${
                    !postId
                      ? "bg-gray-300 border-gray-400 opacity-70 grayscale"
                      : "bg-linear-to-br from-purple-50 to-indigo-50 border-purple-200 hover:border-purple-300 hover:shadow-lg"
                  }`}
                onClick={() => postId && handleAIGenerate()}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Generar con Magia (IA)
                  </h3>
                  <p className="text-gray-600 mb-4">✨</p>

                  {/* Number Pills */}
                  <div className="flex gap-2 mb-4">
                    {[3, 5, 7].map((count) => (
                      <span
                        key={count}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click from triggering
                          if (postId) {
                            setSelectedCount(count);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                          ${
                            postId
                              ? selectedCount === count
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                          }`}
                      >
                        {count} preguntas
                      </span>
                    ))}
                  </div>

                  {!postId && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            </Tooltip>

            {/* Manual Creation Card */}
            <div
              className="flex-1 rounded-xl border-2 border-gray-200 bg-linear-to-br from-blue-50 to-cyan-50 p-6 transition-all duration-200 hover:border-blue-300 hover:shadow-lg cursor-pointer"
              onClick={handleManualCreate}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  <Edit3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Crear a Mano</h3>
                <p className="text-gray-600 mb-4">✏️</p>
                <p className="text-gray-700">
                  Diseña tus propias preguntas personalizadas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Quiz Generator for when quiz exists and blog is published */}
        {hasSavedQuiz && postId && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-3">Opciones de quiz</h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* AI Generation Card - for replacing current quiz */}
              <div
                className="flex-1 rounded-xl border-2 border-gray-200 bg-linear-to-br from-purple-50 to-indigo-50 p-6 transition-all duration-200 hover:border-purple-300 hover:shadow-lg cursor-pointer"
                onClick={handleAIGenerate}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Actualizar con Magia (IA)
                  </h3>
                  <p className="text-gray-600 mb-4">✨</p>

                  {/* Number Pills */}
                  <div className="flex gap-2 mb-4">
                    {[3, 5, 7].map((count) => (
                      <span
                        key={count}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click from triggering
                          setSelectedCount(count);
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                          ${
                            selectedCount === count
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                      >
                        {count} preguntas
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Manual Creation Card - for editing current quiz */}
              <div
                className="flex-1 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all duration-200 hover:border-blue-300 hover:shadow-lg cursor-pointer"
                onClick={handleManualCreate}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    <Edit3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Editar a Mano</h3>
                  <p className="text-gray-600 mb-4">✏️</p>
                  <p className="text-gray-700">
                    Modifica tus preguntas existentes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          hasSavedQuiz
            ? isEditingQuiz
              ? "Editar Quiz"
              : "Vista Previa del Quiz"
            : "Crear Quiz"
        }
      >
        <div className="flex flex-col items-center gap-4">
          <ViewModeToggler
            activeView={activeView}
            onViewChange={setActiveView}
          />
          {handlePreview()}
        </div>
      </QuizModal>
    </>
  );
}
