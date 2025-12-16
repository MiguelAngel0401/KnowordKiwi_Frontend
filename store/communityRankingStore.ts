import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CommunityRanking } from "@/types/community";

type CommunityRankingState = {
  // Ranking data for the current community
  communityRanking: CommunityRanking | null;
  // Current community ID to track which community data belongs to
  currentCommunityId: number | null;
  
  // Set the community ranking data
  setCommunityRanking: (communityId: number, rankingData: CommunityRanking) => void;
  // Reset the community ranking data
  resetCommunityRanking: () => void;
  // Check if we need to update the data based on community ID change
  updateCommunityRankingIfNeeded: (communityId: number, rankingData: CommunityRanking) => void;
};

export const useCommunityRankingStore = create<CommunityRankingState>()(
  devtools(
    (set, get) => ({
      communityRanking: null,
      currentCommunityId: null,
      
      setCommunityRanking: (communityId, rankingData) => 
        set({ communityRanking: rankingData, currentCommunityId: communityId }),
      
      resetCommunityRanking: () => 
        set({ communityRanking: null, currentCommunityId: null }),
      
      updateCommunityRankingIfNeeded: (communityId, rankingData) => {
        const { currentCommunityId } = get();
        if (currentCommunityId !== communityId) {
          set({ communityRanking: rankingData, currentCommunityId: communityId });
        }
      }
    }),
  ),
);