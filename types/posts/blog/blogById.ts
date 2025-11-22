export interface BlogById {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  community: {
    id: number;
  };
  author: {
    user: {
      id: number;
      username: string;
    };
  };
  blogContent: {
    content: string;
    subtitle: string;
  };
  questions?: {
    id: number;
    title: string;
    options: Array<{ text: string; isCorrect: boolean }>;
    postId: number;
    createdAt: string;
    updatedAt: string;
  }[];
}
