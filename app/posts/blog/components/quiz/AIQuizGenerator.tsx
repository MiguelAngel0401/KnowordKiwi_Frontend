import { Button } from '@headlessui/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlogPostFormData } from '@/app/posts/blog/schemas';
import { aiQuizService } from '@/services/ai-quiz/aiQuizService';
import { Question } from '@/types/posts/quiz/question';

interface AIQuizGeneratorProps {
  postId?: number; // Post ID is required for generating quiz from existing blog
  formMethods: UseFormReturn<BlogPostFormData>;
  onQuizGenerated?: (questions: Question[]) => void;
}

const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  postId,
  formMethods,
  onQuizGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(5);

  const generateQuiz = async (numberOfQuestions: number = 5) => {
    if (!postId) {
      setError('No se puede generar un quiz de IA sin un ID de publicación existente. Guarda tu blog primero.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await aiQuizService.generateQuiz(postId, numberOfQuestions);
      const questions = response.questions;

      if (questions.length === 0) {
        setError('No se generaron preguntas. Intenta nuevamente con un contenido más detallado.');
        setIsGenerating(false);
        return;
      }

      // Update the form with the generated questions
      formMethods.setValue('quiz', questions);

      // Call the callback if provided
      if (onQuizGenerated) {
        onQuizGenerated(questions);
      }

      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Error al generar el quiz. Por favor, intenta nuevamente.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => generateQuiz(selectedCount)}
          disabled={isGenerating || !postId}
          className={`
            flex items-center gap-2 py-3 px-6 rounded-xl font-semibold transition duration-200
            ${isGenerating || !postId
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isGenerating ? (
            <>
              <span className="animate-spin">⏳</span>
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generar Quiz con IA
            </>
          )}
        </Button>

        <div className="flex gap-2">
          {[3, 5, 7].map((count) => (
            <Button
              key={count}
              onClick={() => setSelectedCount(count)}
              disabled={isGenerating || !postId}
              className={`
                py-2 px-4 rounded-lg text-sm font-medium
                ${selectedCount === count
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                }
                ${isGenerating || !postId ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {count} preguntas
            </Button>
          ))}
        </div>
      </div>

      {!postId && (
        <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-500 text-yellow-200 rounded-lg">
          <p className="text-sm">Guarda tu blog primero para poder generar un quiz con IA.</p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-900/30 border border-red-500 text-red-200 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AIQuizGenerator;