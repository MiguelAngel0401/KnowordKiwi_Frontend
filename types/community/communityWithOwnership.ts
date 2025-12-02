import { Community } from ".";

export interface CommunityWithOwnership extends Community {
  isOwner: boolean;
  isMember: boolean;
  userTotalXp: number;
  userCurrentRank: string;
  userNextRankXp: number;
  userNextRankName: string;
}
