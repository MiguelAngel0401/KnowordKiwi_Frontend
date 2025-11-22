import { Tag } from "./communityTag";

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  banner: string | null;
  isPrivate: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tags: Tag[];
  memberCount: number;
}
