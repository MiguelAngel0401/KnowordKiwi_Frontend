export interface BlogsByCommunity {
  id: number;
  title: string;
  createdAt: string;
  community: {
    id: number;
    name: string;
    avatar: string;
  };
  author: {
    user: {
      id: number;
      username: string;
      realName: string;
      avatar?: string;
    };
  };
  blogContent: {
    subtitle: string;
  };
}
