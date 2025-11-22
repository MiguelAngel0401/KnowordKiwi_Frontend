import { Question } from "../quiz/question";

// Define el tipo para el borrador
export interface BlogDraft {
  title: string;
  subtitle: string;
  content: string;
  quiz?: Question[];
  lastSaved: Date;
}
