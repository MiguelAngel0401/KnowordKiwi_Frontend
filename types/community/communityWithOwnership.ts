import { Community } from ".";

export interface CommunityWithOwnership extends Community {
  isOwner: boolean;
  isMember: boolean;
}
