import privateApiClient from "../client/privateApiClient";
import { Question } from "@/types/posts/quiz/question";

interface CreateManyQuestionsRequest {
  postId: number;
  questions: {
    title: string;
    options: Array<{ text: string; isCorrect: boolean }>;
  }[];
}

interface CreateManyQuestionsResponse {
  count: number;
}

interface EditQuestionsRequest {
  questions: {
    id?: number;
    title: string;
    options: Array<{ text: string; isCorrect: boolean }>;
  }[];
}

interface EditQuestionsResponse {
  message: string;
}

export const questionsService = {
  createManyQuestions: async (
    request: CreateManyQuestionsRequest
  ): Promise<CreateManyQuestionsResponse> => {
    const response = await privateApiClient.post<CreateManyQuestionsResponse>(
      "/questions/create-many",
      request
    );
    return response.data;
  },

  getQuestionsByPostId: async (postId: number): Promise<Question[]> => {
    const response = await privateApiClient.get(`/questions/by-post/${postId}`);
    return response.data;
  },

  updatePostQuestions: async (
    postId: number,
    request: EditQuestionsRequest
  ): Promise<EditQuestionsResponse> => {
    const response = await privateApiClient.put<EditQuestionsResponse>(
      `/questions/update/${postId}`,
      request
    );
    return response.data;
  },
};