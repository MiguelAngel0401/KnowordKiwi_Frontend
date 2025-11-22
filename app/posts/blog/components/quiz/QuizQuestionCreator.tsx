import { Question } from "@/types/posts/quiz/question";
import { Option } from "@/types/posts/quiz/option";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { QuizQuestionFormData, quizQuestionSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@headlessui/react";
import { Pencil, Trash } from "lucide-react";

interface QuizQuestionCreatorProps {
  postId?: number; // Optional - only provided when adding to existing post
  initialQuestions?: Question[];
  onSave: (questions?: Question[]) => void;
}

const QuizQuestionCreator: React.FC<QuizQuestionCreatorProps> = ({
  initialQuestions = [],
  onSave,
}) => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuizQuestionFormData>({
    resolver: zodResolver(quizQuestionSchema),
    mode: "onChange",
    defaultValues: {
      questionTitle: "",
    },
  });

  const questionTitle = watch("questionTitle");

  const [options, setOptions] = useState<Option[]>([
    {
      text: "",
      isCorrect: false,
      id: "A",
      color: "bg-purple-600 border-purple-600",
    },
    {
      text: "",
      isCorrect: false,
      id: "B",
      color: "bg-yellow-500 border-yellow-500",
    },
    {
      text: "",
      isCorrect: false,
      id: "C",
      color: "bg-green-500 border-green-500",
    },
    { text: "", isCorrect: false, id: "D", color: "bg-red-600 border-red-600" },
  ]);
  const [selectedCorrectOption, setSelectedCorrectOption] = useState<
    string | null
  >(null);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleOptionTextChange = (index: number, value: string) => {
    if (value.length > 100) return; // Limitar a 100 caracteres

    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);

    // Check for duplicate options in real-time
    const nonEmptyOptions = newOptions.filter((opt) => opt.text.trim() !== "");
    const optionTexts = nonEmptyOptions.map((opt) =>
      opt.text.trim().toLowerCase(),
    );
    const uniqueOptionTexts = new Set(optionTexts);

    if (optionTexts.length !== uniqueOptionTexts.size) {
      setErrorMessage(
        "Las opciones de respuesta no pueden repetirse. Por favor, asegúrate que cada opción tenga un texto diferente.",
      );
    } else {
      // Only clear error if it was specifically about duplicate options
      if (errorMessage?.includes("no pueden repetirse")) {
        setErrorMessage(null);
      }
    }
  };

  const handleCorrectOptionChange = (id: string) => {
    const newOptions = options.map((option) => ({
      ...option,
      isCorrect: option.id === id,
    }));
    setOptions(newOptions);
    setSelectedCorrectOption(id);

    // Clear the "no correct option selected" error when a correct option is selected
    if (errorMessage?.includes("selecciona la respuesta correcta")) {
      setErrorMessage(null);
    }
  };

  const handleAddQuestion = () => {
    setIsEditing(false);
    if (!questionTitle.trim() || options.some((opt) => !opt.text.trim())) {
      setErrorMessage(
        "Por favor, completa el título de la pregunta y todas las opciones.",
      );
      return;
    }

    // Validate that no two options have the same text
    const nonEmptyOptions = options.filter((opt) => opt.text.trim() !== "");
    const optionTexts = nonEmptyOptions.map((opt) =>
      opt.text.trim().toLowerCase(),
    );
    const uniqueOptionTexts = new Set(optionTexts);

    if (optionTexts.length !== uniqueOptionTexts.size) {
      setErrorMessage(
        "Las opciones de respuesta no pueden repetirse. Por favor, asegúrate que cada opción tenga un texto diferente.",
      );
      return;
    }

    if (!selectedCorrectOption) {
      setErrorMessage("Por favor, selecciona la respuesta correcta.");
      return;
    }

    if (questions.length >= 10) {
      setErrorMessage("No puedes agregar más de 10 preguntas por quiz.");
      return;
    }

    const newQuestion: Question = {
      title: questionTitle,
      options: options.map(({ text, isCorrect }) => ({ text, isCorrect })),
    };

    setQuestions([...questions, newQuestion]);

    // Reset the form
    reset({ questionTitle: "" });
    setOptions([
      {
        text: "",
        isCorrect: false,
        id: "A",
        color: "bg-purple-600 border-purple-600",
      },
      {
        text: "",
        isCorrect: false,
        id: "B",
        color: "bg-yellow-500 border-yellow-500",
      },
      {
        text: "",
        isCorrect: false,
        id: "C",
        color: "bg-green-500 border-green-500",
      },
      {
        text: "",
        isCorrect: false,
        id: "D",
        color: "bg-red-600 border-red-600",
      },
    ]);
    setSelectedCorrectOption(null);
    setErrorMessage(null);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleEditQuestion = (index: number) => {
    setIsEditing(true);
    const questionToEdit = questions[index];
    // Populate the form with the question data
    reset({ questionTitle: questionToEdit.title });
    const updatedOptions = questionToEdit.options.map((opt, idx) => ({
      text: opt.text,
      isCorrect: opt.isCorrect,
      id: String.fromCharCode(65 + idx),
      color:
        idx === 0
          ? "bg-purple-600 border-purple-600"
          : idx === 1
            ? "bg-yellow-500 border-yellow-500"
            : idx === 2
              ? "bg-green-500 border-green-500"
              : "bg-red-600 border-red-600",
    }));
    setOptions(updatedOptions);
    const correctOption = updatedOptions.find((opt) => opt.isCorrect);
    setSelectedCorrectOption(correctOption ? correctOption.id : null);

    // Remove the question from the list to allow re-adding after edit
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);

    // Clear the error message
    setErrorMessage(null);
  };

  const handleSubmitQuiz = async () => {
    if (questions.length === 0) {
      setErrorMessage("Debes agregar al menos una pregunta al quiz.");
      return;
    }

    // En lugar de interactuar con servicios, simplemente notificamos al padre.
    // El componente padre (Create/Edit page) es responsable de la persistencia.
    setIsSubmitting(true);
    try {
      onSave(questions);
      setErrorMessage(
        "Ocurrió un error al guardar las preguntas. Por favor intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-8 my-8 text-gray-100 font-sans">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-extrabold text-white">Crear Nuevo Quiz</h3>
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                questions.length >= 8
                  ? "bg-red-500"
                  : questions.length >= 5
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${(questions.length / 10) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mt-2">
            Preguntas agregadas: {questions.length}/10
          </p>
        </div>
      </div>

      {/* Formulario para nueva pregunta */}
      <div className="mb-10 p-6  rounded-xl">
        <h4 className="text-xl font-bold text-white mb-4">
          Agregar Nueva Pregunta
        </h4>
        {/* Área de la Pregunta */}
        <div className="mb-6">
          <label
            htmlFor="question-text"
            className="block mb-3 text-lg font-medium text-gray-300"
          >
            Título de la Pregunta:
          </label>
          <Input
            id="question-text"
            className="w-full p-4 border border-gray-700 rounded-xl bg-bg-gray placeholder-gray-500 focus:ring-primary focus:border-primary-hover transition duration-200 text-white"
            placeholder="Escribe el texto de tu pregunta aquí..."
            {...register("questionTitle")}
          />
          {errors.questionTitle && (
            <p className="text-red-400 text-sm mt-1">
              {errors.questionTitle.message}
            </p>
          )}
        </div>

        <p className="mb-5 text-gray-300">
          Selecciona la respuesta correcta y escribe todas las opciones para tu
          pregunta.
        </p>

        {/* Opciones de Respuesta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {options.map((option, index) => (
            <div
              key={option.id}
              // Clases base para la tarjeta de opción
              className={`
                flex items-center p-4 rounded-xl cursor-pointer transition duration-300 transform hover:scale-[1.02]
                bg-bg-gray shadow-lg border-2 border-gray-600
                ${selectedCorrectOption === option.id ? `${option.color} ring-4 ring-opacity-50 ring-offset-2 ring-offset-gray-800` : ""}
              `}
              onClick={() => handleCorrectOptionChange(option.id)}
            >
              {/* Letra de Opción (ID) */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex justify-center items-center text-xl font-bold text-white mr-4 flex-shrink-0
                  ${option.color.split(" ")[0]}
                `}
              >
                {option.id}
              </div>

              {/* Input de la Opción */}
              <input
                type="text"
                className="flex-grow bg-transparent border-none text-white text-base placeholder-gray-400 focus:ring-0 focus:outline-none p-0"
                value={option.text}
                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                placeholder={`Escribe la respuesta ${option.id} aquí...`}
                // Importante: Detiene la propagación para que hacer clic en el input no marque la opción como correcta.
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="mt-4 mb-6 p-4 bg-opacity-20 border border-red-500 text-red-300 rounded-lg">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Botón para agregar pregunta */}
        <Button
          onClick={handleAddQuestion}
          className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold text-lg rounded-xl transition duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
        >
          {isEditing ? "Guardar Cambios" : "Agregar Pregunta"}
        </Button>
      </div>

      {/* Lista de preguntas agregadas */}
      {questions.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-4">
            Preguntas del Quiz
          </h4>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {questions.map((question, index) => (
              <div
                key={index}
                className="p-4 bg-bg-gray rounded-xl border border-gray-700 flex justify-between items-start"
              >
                <div>
                  <h5 className="font-semibold text-white">
                    Pregunta {index + 1}: {question.title}
                  </h5>
                  <div className="mt-2 space-y-1">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${
                            option.isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span
                          className={
                            option.isCorrect
                              ? "text-green-400 font-medium"
                              : "text-gray-300"
                          }
                        >
                          {option.text} {option.isCorrect && "(Correcta)"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center mt-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="text-red-400 hover:text-error ml-4 p-2 rounded-full hover:bg-red-900/20 transition duration-200"
                    aria-label="Eliminar pregunta"
                  >
                    <Trash />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleEditQuestion(index)}
                    className="text-blue-400 hover:text-blue-600 ml-2 p-2 rounded-full hover:bg-blue-900/20 transition duration-200"
                    aria-label="Editar pregunta"
                  >
                    <Pencil />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón para enviar todo el quiz */}
      <Button
        onClick={handleSubmitQuiz}
        disabled={isSubmitting || questions.length === 0}
        className={`w-full py-4 ${
          isSubmitting || questions.length === 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white font-extrabold text-xl rounded-xl transition duration-200 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transform hover:-translate-y-0.5`}
      >
        {isSubmitting
          ? "Guardando Quiz..."
          : `Guardar Quiz (${questions.length} pregunta${questions.length !== 1 ? "s" : ""})`}
      </Button>
    </div>
  );
};

export default QuizQuestionCreator;
