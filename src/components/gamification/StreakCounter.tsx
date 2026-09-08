import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  days: number;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ days, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-800 font-bold text-xs sm:text-sm shadow-sm ${className}`}
      title={`${days} Day Learning Streak`}
    >
      <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
      <span>{days}</span>
      <span className="text-orange-700/80 font-medium text-xs hidden sm:inline">Days</span>
    </div>
  );
};
