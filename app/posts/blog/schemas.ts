import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, "El título es obligatorio y debe tener al menos 5 caracteres")
    .max(200, "El título no debe exceder los 200 caracteres"),
  subtitle: z
    .string()
    .min(5, "El subtítulo es obligatorio y debe tener al menos 5 caracteres")
    .max(300, "El subtítulo no debe exceder los 300 caracteres"),
  content: z
    .string()
    .min(50, "El contenido es obligatorio y debe tener al menos 50 caracteres")
    .max(50000, "El contenido no debe exceder los 50,000 caracteres"),
  quiz: z
    .array(
      z.object({
        id: z.number().optional(),
        title: z.string(),
        options: z.array(
          z.object({
            text: z.string(),
            isCorrect: z.boolean(),
          }),
        ),
      }),
    )
    .optional(),
});

export const quizQuestionSchema = z.object({
  questionTitle: z
    .string()
    .min(5, "El título de la pregunta debe tener al menos 5 caracteres")
    .max(100, "El título de la pregunta no debe exceder los 500 caracteres"),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type QuizQuestionFormData = z.infer<typeof quizQuestionSchema>;
