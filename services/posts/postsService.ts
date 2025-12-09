import privateApiClient from "@/services/client/privateApiClient";

export interface PostByCommunity {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  community: {
    id: number;
    name: string;
    avatar: string | null;
  };
  author: {
    user: {
      id: number;
      username: string;
      realName: string;
      avatar: string | null;
    };
  };
  blogContent?: {
    content: string;
    subtitle: string;
  };
  imageContent?: {
    imageUrl: string;
    description: string | null;
    imageTags: Array<{
      id: number;
      name: string;
      createdAt: string;
    }>
  };
  excalidrawContent?: {
    id: number;
    diagramData: {
      type: string;
      version: number;
      source: string;
      elements: any[];
      appState: any;
    };
    postId: number;
    createdAt: string;
    updatedAt: string;
  };
  questions?: Array<{
    id: number;
    title: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
    postId: number;
  }>;
}

export const getAllPostsByCommunity = async (
  communityId: number
): Promise<PostByCommunity[]> => {
  try {
    const response = await privateApiClient.get(`/posts/community/${communityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts by community:", error);
    throw error;
  }
};