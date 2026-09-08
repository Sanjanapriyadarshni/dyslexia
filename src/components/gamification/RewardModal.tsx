import React, { useEffect } from 'react';
import { Sparkles, Star, Zap, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { soundEngine } from '../../hooks/useSound';
import { BADGES } from '../../data/mockData';
import { XPBar } from './XPBar';

interface RewardModalProps {
  isOpen: boolean;
  gameTitle: string;
  earnedXP: number;
  earnedStars: number;
  totalXP: number;
  unlockedBadgeId?: string | null;
  skillGrowth?: {
    skillName: string;
    previousScore: number;
    newScore: number;
  } | null;
  onPlayAgain: () => void;
  onContinue: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  gameTitle,
  earnedXP,
  earnedStars,
  totalXP,
  unlockedBadgeId,
  skillGrowth,
  onPlayAgain,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playCheer();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedBadge = unlockedBadgeId ? BADGES.find((b) => b.id === unlockedBadgeId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 sm:p-8 text-center overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Celebration Stars */}
        <div className="flex justify-center -mt-2 mb-3">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-lg ring-8 ring-amber-100 animate-bounce">
              🎉
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-1">
          Incredible Work!
        </h3>
        <p className="text-sm font-semibold text-slate-500 mb-5">
          You completed <span className="text-teal-700 font-bold">{gameTitle}</span>
        </p>

        {/* Rewards Cards */}
        <div className="grid grid-cols-2 gap-3.5 mb-5">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300 rounded-2xl p-3.5 flex flex-col items-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mb-1 shadow-sm">
              <Zap className="w-5 h-5 fill-amber-950" />
            </div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">XP Earned</span>
            <span className="text-2xl font-black text-amber-950">+{earnedXP}</span>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-300 rounded-2xl p-3.5 flex flex-col items-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-yellow-400 text-yellow-950 flex items-center justify-center mb-1 shadow-sm">
              <Star className="w-5 h-5 fill-yellow-950" />
            </div>
            <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Stars Earned</span>
            <span className="text-2xl font-black text-yellow-950">+{earnedStars}</span>
          </div>
        </div>

        {/* Skill Growth indicator */}
        {skillGrowth && (
          <div className="mb-5 bg-teal-50 border border-teal-200 rounded-2xl p-3 text-left flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-teal-900">{skillGrowth.skillName} Growth</p>
              <p className="text-[11px] text-teal-700 font-medium">Practice boosts mastery!</p>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-teal-800 bg-white px-2.5 py-1 rounded-xl shadow-sm border border-teal-100">
              <span>{skillGrowth.previousScore}%</span>
              <span>→</span>
              <span className="text-emerald-600 font-extrabold">{skillGrowth.newScore}%</span>
              <span className="text-xs text-emerald-600 font-black">(+4%)</span>
            </div>
          </div>
        )}

        {/* Unlocked Badge Alert if any */}
        {unlockedBadge && (
          <div className="mb-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-3 flex items-center gap-3 text-left">
            <div className="text-3xl">{unlockedBadge.icon}</div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full mb-0.5">
                <Award className="w-3 h-3" /> New Badge Unlocked!
              </span>
              <h5 className="font-bold text-slate-800 text-sm truncate">{unlockedBadge.id}</h5>
            </div>
          </div>
        )}

        {/* Level & XP Progress preview */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <XPBar xp={totalXP} showDetails={true} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-300 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 px-5 rounded-2xl font-extrabold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
