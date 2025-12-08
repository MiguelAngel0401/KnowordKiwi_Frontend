import { Field, Label, Switch } from "@headlessui/react";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogPostFormData } from "@/app/posts/blog/schemas";
import QuizModal from "../modals/QuizModal";
import BlogPreview from "../blog/BlogPreview";
import QuizQuestionCreator from "./QuizQuestionCreator";
import QuizDisplay from "./QuizDisplay";
import ViewModeToggler, { ViewMode } from "./ViewModeToggler";
import { Question } from "@/types/posts/quiz/question";
import AIQuizGenerator from "./AIQuizGenerator";

interface QuizCreatorProps {
  formMethods: UseFormReturn<BlogPostFormData>;
  postId?: number; // Post ID for AI generation
  onQuizChange?: () => void;
}

export default function QuizSection({ formMethods, postId, onQuizChange }: QuizCreatorProps) {
  const { watch, setValue } = formMethods;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>("quiz");

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

  return (
    <>
      <Field as="div" className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {hasSavedQuiz ? (
            <>
              <Label className="text-lg">Quiz guardado en el borrador</Label>
              <button
                onClick={handleShowSavedQuiz}
                className="text-blue-500 hover:text-blue-400 underline text-lg"
              >
                Ver quiz
              </button>
            </>
          ) : (
            <>
              <Label className="text-lg">
                ¿Deseas añadir un quiz a tu publicación?
              </Label>
            </>
          )}
        </div>
        {!hasSavedQuiz && (
          <div className="flex flex-col gap-4">
            <AIQuizGenerator
              postId={postId}
              formMethods={formMethods}
              onQuizGenerated={() => {
                // When AI generates questions, we automatically open the modal to show them
                setIsModalOpen(true);
                if (onQuizChange) {
                  onQuizChange();
                }
              }}
            />
            <div className="flex justify-center">
              <Switch
                checked={isModalOpen}
                onChange={setIsModalOpen}
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-primary"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
              </Switch>
            </div>
          </div>
        )}
        {hasSavedQuiz && (
          <AIQuizGenerator
            postId={postId}
            formMethods={formMethods}
            onQuizGenerated={() => {
              // When AI generates questions, we automatically open the modal to show them
              setIsModalOpen(true);
              if (onQuizChange) {
                onQuizChange();
              }
            }}
          />
        )}
      </Field>
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
