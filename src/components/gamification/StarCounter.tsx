import React from 'react';
import { Star } from 'lucide-react';

interface StarCounterProps {
  stars: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarCounter: React.FC<StarCounterProps> = ({ stars, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5 font-bold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-300 text-amber-900 font-bold shadow-sm ${sizeClasses[size]} ${className}`}
      title={`${stars} Stars Earned`}
    >
      <Star className={`${iconSizes[size]} fill-amber-400 text-amber-500`} />
      <span>{stars}</span>
      <span className="text-amber-700/80 font-medium text-xs hidden sm:inline">Stars</span>
    </div>
  );
};
