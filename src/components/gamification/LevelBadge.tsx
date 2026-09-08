import React from 'react';
import { Award } from 'lucide-react';
import { calculateLevel } from '../../services/gamificationService';

interface LevelBadgeProps {
  xp: number;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ xp, className = '' }) => {
  const levelInfo = calculateLevel(xp);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-900 font-semibold shadow-sm text-xs sm:text-sm ${className}`}
    >
      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow">
        {levelInfo.level}
      </div>
      <Award className="w-4 h-4 text-indigo-600" />
      <span className="font-bold text-indigo-950">{levelInfo.title}</span>
    </div>
  );
};
