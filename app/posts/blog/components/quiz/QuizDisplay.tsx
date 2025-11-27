import { Question } from "@/types/posts/quiz/question";
import { Button } from "@headlessui/react";
import { Pencil } from "lucide-react";

interface QuizDisplayProps {
  questions: Question[];
  onEdit: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ questions, onEdit }) => {
  return (
    <div className="w-full p-8 my-8 text-gray-100 font-sans">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-700 mt-2">
          Preguntas guardadas: {questions.length}
        </p>
        <Button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary-hover transition-colors"
        >
          <Pencil size={16} /> Editar Quiz
        </Button>
      </div>

      <div className="space-y-8">
        {questions.map((question, questionIndex) => (
          <div
            key={question.id || questionIndex}
            className="p-6 rounded-xl bg-bg-gray border border-gray-700 shadow-lg"
          >
            <h4 className="text-xl font-bold text-text-color mb-4">
              Pregunta {questionIndex + 1}: {question.title}
            </h4>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`
                    flex items-center p-4 rounded-xl
                    ${
                      option.isCorrect
                        ? "bg-secondary border-2 border-green-500"
                        : "bg-bg-gray border border-gray-600"
                    }
                  `}
                >
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex justify-center items-center 
                    text-xl font-bold text-white mr-4 flex-shrink-0
                    ${
                      option.isCorrect
                        ? "bg-green-500 border-green-500"
                        : "bg-tag border-gray-600"
                    }
                  `}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </div>
                  <div className="flex-grow">
                    <span
                      className={
                        option.isCorrect
                          ? "text-white font-bold"
                          : "text-gray-800"
                      }
                    >
                      {option.text}
                    </span>
                    {option.isCorrect && (
                      <span className="ml-2 text-white font-medium">
                        (Correcta)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDisplay;
