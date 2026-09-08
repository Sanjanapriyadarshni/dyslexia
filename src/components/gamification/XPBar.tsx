import React from 'react';
import { Zap } from 'lucide-react';
import { calculateLevel } from '../../services/gamificationService';

interface XPBarProps {
  xp: number;
  showDetails?: boolean;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({ xp, showDetails = true, className = '' }) => {
  const levelInfo = calculateLevel(xp);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
          <span className="flex items-center gap-1 text-amber-600 font-bold">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
            <span>Level {levelInfo.level}</span>
            <span className="text-slate-400 font-normal">({levelInfo.title})</span>
          </span>
          <span className="font-bold text-slate-600">
            {xp} <span className="text-slate-400 font-normal">/ {levelInfo.nextLevelXp} XP</span>
          </span>
        </div>
      )}
      <div className="relative w-full h-3 sm:h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${Math.max(6, levelInfo.progressPercent)}%` }}
        />
      </div>
    </div>
  );
};
