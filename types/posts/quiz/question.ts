export interface Question {
  id?: number; // Optional for new questions being created
  title: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}
