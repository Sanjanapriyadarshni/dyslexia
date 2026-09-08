import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Lock,
  CheckCircle2,
  Play,
  Filter,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import { ALL_GAMES_METADATA } from '../../data/mockData';
import { StarCounter, LevelBadge } from '../gamification';
import type { GameMetadata } from '../../types';

export const GameHub: React.FC = () => {
  const { gamification, setScreen } = useProfile();
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'letters' | 'words' | 'reading' | 'spelling'>('all');

  const filteredGames = ALL_GAMES_METADATA.filter((game) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'letters') return game.id === 'letter-match' || game.id === 'sound-builder';
    if (selectedFilter === 'words') return game.id === 'word-builder';
    if (selectedFilter === 'reading') return game.id === 'read-aloud' || game.id === 'story-explorer';
    if (selectedFilter === 'spelling') return game.id === 'spell-quest';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-amber-50/40 to-teal-50/60 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-2 border-sky-100 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen('learning-dashboard')}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 shadow-sm active:scale-95"
              title="Back to Adventure Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span>All Learning Games</span>
                <span className="text-xl">🎮</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Choose any game to boost your reading and writing superpowers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LevelBadge xp={gamification.xp} />
            <StarCounter stars={gamification.stars || 0} size="md" />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-white/70 backdrop-blur-sm p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 px-3 text-xs font-bold text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {(
            [
              { key: 'all', label: 'All Activities (6)' },
              { key: 'letters', label: '🔤 Letters & Sounds' },
              { key: 'words', label: '🧩 Word Building' },
              { key: 'reading', label: '📖 Reading & Stories' },
              { key: 'spelling', label: '✍️ Spelling' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === tab.key
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game: GameMetadata) => {
            const isCompleted = gamification.completedGameIds?.includes(game.id);
            const isLocked = gamification.level < game.minLevelRequired;

            return (
              <div
                key={game.id}
                className={`relative rounded-3xl bg-white border-2 transition-all flex flex-col justify-between overflow-hidden group ${
                  isLocked
                    ? 'border-slate-200 opacity-80'
                    : 'border-slate-200 hover:border-teal-300 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Top Banner Color Strip */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${game.bgGradient}`} />

                <div className="p-6 space-y-4">
                  {/* Header: Icon, Tags, Completed status */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.bgGradient} flex items-center justify-center text-3xl shadow-md border-2 border-white ring-4 ring-slate-50 group-hover:scale-105 transition-transform`}
                    >
                      {game.emoji}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Done
                        </span>
                      )}
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <Lock className="w-3 h-3 text-slate-500" />
                          Lvl {game.minLevelRequired}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                        {game.skillName}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">
                      {t(game.titleKey) || game.titleKey}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2">
                      {t(game.descKey) || game.descKey}
                    </p>
                  </div>

                  {/* Difficulty, Duration, Rewards */}
                  <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-1" title={`Difficulty: ${game.difficulty}/3`}>
                      <span>Difficulty:</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < game.difficulty ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        +{game.xpReward} XP
                      </span>
                      <span>⏱️ {game.estimatedMinutes}m</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                  {isLocked ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-2xl font-bold text-slate-400 bg-slate-200 cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Unlocks at Level {game.minLevelRequired}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setScreen(game.screenId)}
                      className="w-full py-3 px-4 rounded-2xl font-black text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isCompleted ? 'Play Again' : 'Play Game'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
