import { Tag } from "./communityTag";

export interface Community {
  id: number;
  name: string;
  description: string;
  avatar: string | null;
  banner: string | null;
  isPrivate: boolean;
  createdById: number;
  createdAt: string;
  tags: Tag[];
  memberCount: number;
}
