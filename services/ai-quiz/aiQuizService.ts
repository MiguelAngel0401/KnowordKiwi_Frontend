import privateApiClient from '../client/privateApiClient';
import { Question } from '@/types/posts/quiz/question';

interface GenerateQuizRequest {
  numberOfQuestions?: number;
}

interface GenerateQuizResponse {
  message: string;
  count: number;
  questions: Question[];
}

interface PreviewQuizResponse {
  message: string;
  questions: Question[];
}

export const aiQuizService = {
  generateQuiz: async (
    postId: number,
    numberOfQuestions: number = 5
  ): Promise<GenerateQuizResponse> => {
    const response = await privateApiClient.post<GenerateQuizResponse>(
      `/ai-quiz/generate/${postId}`,
      { numberOfQuestions }
    );
    return response.data;
  },

  previewQuiz: async (
    postId: number,
    numberOfQuestions: number = 5
  ): Promise<PreviewQuizResponse> => {
    const response = await privateApiClient.get<PreviewQuizResponse>(
      `/ai-quiz/preview/${postId}`,
      { 
        params: { numberOfQuestions }
      }
    );
    return response.data;
  },
};