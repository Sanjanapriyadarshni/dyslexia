import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import type { Badge } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface BadgeCardProps {
  badge: Badge;
  unlocked?: boolean;
  className?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked, className = '' }) => {
  const { t } = useLanguage();
  const isUnlocked = unlocked !== undefined ? unlocked : badge.isUnlocked;

  const title = t(badge.titleKey) || badge.titleKey;
  const desc = t(badge.descKey) || badge.descKey;

  return (
    <div
      className={`relative rounded-2xl p-4 border-2 transition-all flex flex-col items-center text-center group ${
        isUnlocked
          ? 'bg-gradient-to-b from-white to-amber-50/50 border-amber-300 shadow-md hover:shadow-lg hover:-translate-y-1'
          : 'bg-slate-50/80 border-slate-200 opacity-75 grayscale hover:grayscale-0'
      } ${className}`}
    >
      {/* Top Status Icon */}
      <div className="absolute top-2.5 right-2.5">
        {isUnlocked ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
        ) : (
          <Lock className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {/* Badge Icon Circle */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-2.5 shadow-sm transition-transform group-hover:scale-110 ${
          isUnlocked
            ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 ring-4 ring-amber-100 shadow-amber-200'
            : 'bg-slate-200 text-slate-400 ring-2 ring-slate-100'
        }`}
      >
        {badge.icon}
      </div>

      {/* Title & Description */}
      <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{desc}</p>

      {/* Progress Bar if not unlocked */}
      {!isUnlocked && (
        <div className="w-full mt-auto">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Progress</span>
            <span>
              {badge.progress} / {badge.maxProgress}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full"
              style={{ width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {isUnlocked && (
        <div className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-full">
          <span>Unlocked!</span>
        </div>
      )}
    </div>
  );
};
