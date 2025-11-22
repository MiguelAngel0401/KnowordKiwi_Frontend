export interface UserProfileResponse {
  user: {
    id: number;
    username: string;
    email: string;
    realName: string;
    avatar: string | null;
    bio: string | null;
  };
}
