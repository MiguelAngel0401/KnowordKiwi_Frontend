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
    <div className={`bg-yellow-100 rounded-2xl shadow-lg p-5 border border-yellow-200 transform rotate-1 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-amber-700 mr-2" />
          <h3 className="text-lg font-bold text-amber-900">Progreso</h3>
        </div>
        <span className="text-xs font-medium text-amber-700">
          {currentXp} / {nextRankXp} XP
        </span>
      </div>

      {/* Rank display */}
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-amber-800">
            Rango actual:
          </span>
          <span className="text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
            {currentRank}
          </span>
        </div>
        {nextRankName && (
          <div className="mt-1 text-xs text-amber-600 text-right">
            Siguiente: {nextRankName}
          </div>
        )}
      </div>

      {/* Experience bar that looks like a highlighter */}
      <div className="w-full bg-stone-200 rounded-xl h-5 mb-2">
        <div
          className="bg-yellow-300 h-5 rounded-xl shadow-inner transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Experience points display */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-amber-500 mr-1" />
          <span className="text-xs font-semibold text-amber-800">
            {currentXp} XP
          </span>
        </div>
        <div className="text-xs text-amber-700 font-medium">{progressPercentage}%</div>
      </div>
    </div>
  );
};

export default UserGamificationBar;
