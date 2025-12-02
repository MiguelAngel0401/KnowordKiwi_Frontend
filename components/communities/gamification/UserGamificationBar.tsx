import React from "react";
import { Trophy, Star } from "lucide-react";

interface UserGamificationBarProps {
  /**
   * The user's current rank within the community
   */
  currentRank: string;
  /**
   * Current experience points of the user
   */
  currentXp: number;
  /**
   * Total experience points required for the next rank
   */
  nextRankXp: number;
  /**
   * The name of the next rank
   */
  nextRankName?: string;
  /**
   * Custom CSS classes for the component
   */
  className?: string;
}

/**
 * A component that displays the user's gamification progress within a community
 * Shows experience bar, current rank, and current XP points
 */
const UserGamificationBar: React.FC<UserGamificationBarProps> = ({
  currentRank,
  currentXp,
  nextRankXp,
  nextRankName = "Desconocido",
  className = "",
}) => {
  // Calculate the progress percentage
  const progressPercentage =
    nextRankXp > 0
      ? Math.min(100, Math.floor((currentXp / nextRankXp) * 100))
      : 0;

  return (
    <div className={`bg-bg-gray rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-bold text-text-color">Progreso</h3>
        </div>
        <span className="text-sm font-semibold text-gray-600">
          {currentXp} / {nextRankXp} XP
        </span>
      </div>

      {/* Rank display */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Rango actual:
          </span>
          <span className="text-sm font-bold text-secondary bg-blue-50 px-3 py-1 rounded-full">
            {currentRank}
          </span>
        </div>
        {nextRankName && (
          <div className="mt-1 text-xs text-gray-500 text-right">
            Siguiente: {nextRankName}
          </div>
        )}
      </div>

      {/* Experience bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Experience points display */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm font-semibold text-gray-700">
            {currentXp} XP
          </span>
        </div>
        <div className="text-xs text-gray-500">{progressPercentage}%</div>
      </div>
    </div>
  );
};

export default UserGamificationBar;
