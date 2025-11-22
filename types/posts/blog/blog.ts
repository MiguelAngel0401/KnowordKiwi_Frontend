export interface BlogPost {
  title: string;
  subtitle: string;
  content: string;
  communityId: number;
  authorUserId?: number;
  questions?: Array<{
    title: string;
    options: Array<{ text: string; isCorrect: boolean }>;
  }>;
}
