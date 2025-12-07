// Example React component using the community ranking store
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCommunityRankingStore } from '@/store/communityRankingStore';
import { getCommunityById } from '@/services/community/communityServices';

const CommunityRankingDisplay = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { communityRanking, setCommunityRanking, currentCommunityId } = useCommunityRankingStore();

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (communityId) {
        try {
          // Parse communityId to number
          const numericCommunityId = parseInt(communityId, 10);
          
          // Only fetch if we're on a different community
          if (currentCommunityId !== numericCommunityId) {
            const response = await getCommunityById(numericCommunityId);
            
            // Extract the ranking information from the API response
            const rankingData = {
              userTotalXp: response.userTotalXp || 0,
              userCurrentRank: response.userCurrentRank || '',
              userNextRankXp: response.userNextRankXp || 0,
              userNextRankName: response.userNextRankName || ''
            };
            
            // Update the store with the new ranking data
            setCommunityRanking(numericCommunityId, rankingData);
          }
        } catch (error) {
          console.error('Error fetching community data:', error);
        }
      }
    };

    fetchCommunityData();
  }, [communityId, currentCommunityId, setCommunityRanking]);

  if (!communityRanking) {
    return <div>Loading community ranking data...</div>;
  }

  return (
    <div className="community-ranking">
      <h3>Your Ranking in Community</h3>
      <p><strong>Current Rank:</strong> {communityRanking.userCurrentRank}</p>
      <p><strong>XP:</strong> {communityRanking.userTotalXp}/{communityRanking.userNextRankXp}</p>
      <p><strong>Next Rank:</strong> {communityRanking.userNextRankName}</p>
    </div>
  );
};

export default CommunityRankingDisplay;