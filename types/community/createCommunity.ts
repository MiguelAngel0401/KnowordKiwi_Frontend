export interface CommunityCreateData {
  name: string;
  description: string;
  isPrivate: boolean;
  tags: string[];
  avatar?: string;
  banner?: string;
}

export type CommunityUpdateData = Partial<CommunityCreateData>;
