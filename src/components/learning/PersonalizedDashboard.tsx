import React from 'react';
import {
  Sparkles,
  Gamepad2,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Home,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { useLanguage } from '../../context/LanguageContext';
import { getPersonalizedRecommendations } from '../../services/recommendationService';
import { BADGES } from '../../data/mockData';
import { XPBar, StarCounter, StreakCounter, LevelBadge, BadgeCard } from '../gamification';

export const PersonalizedDashboard: React.FC = () => {
  const { profile, avatar, gamification, screeningIndicators, setScreen } = useProfile();
  const { screeningReport } = useScreening();
  const { t } = useLanguage();

  // Get dynamic personalized recommendations based on screening performance
  const recommendations = getPersonalizedRecommendations(screeningReport, screeningIndicators);
  const topRec = recommendations[0];
  const secondaryRecs = recommendations.slice(1, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-amber-50/30 to-sky-50/40 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navigation & Profile Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-2 border-teal-100 shadow-sm">
          {/* Avatar & Child Info */}
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl ${avatar.bgGradient} flex items-center justify-center text-3xl shadow-md border-2 border-white ring-2 ring-teal-200`}
            >
              {avatar.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  {profile.name || 'Hero'}
                </h2>
                <LevelBadge xp={gamification.xp} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {avatar.name} • {profile.grade || 'Grade 3'}
              </p>
            </div>
          </div>

          {/* Gamification Stats HUD */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <StreakCounter days={gamification.streakDays || 1} />
            <StarCounter stars={gamification.stars || 0} size="md" />
            <button
              onClick={() => setScreen('home')}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 shadow-sm"
              title="Home Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl shadow-teal-700/10">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-teal-100 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Personalized Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Your Learning Adventure
            </h1>
            <p className="text-teal-100 text-sm sm:text-base font-medium leading-relaxed">
              Let's practice the skills that will help you grow! Every game is tailored to your learning superpower!
            </p>

            {/* XP Progress inside Banner */}
            <div className="pt-2 bg-white/95 text-slate-800 rounded-2xl p-3.5 border border-white/20 mt-2 shadow-sm">
              <XPBar xp={gamification.xp} showDetails={true} />
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-4 bottom-2 text-7xl sm:text-9xl opacity-20 select-none pointer-events-none transform rotate-12">
            🚀
          </div>
        </div>

        {/* Section 1: Recommended for You */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                ⭐
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Recommended for You
              </h3>
            </div>
            <button
              onClick={() => setScreen('game-hub')}
              className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
            >
              <span>See All 6 Games</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Top Priority Recommendation Card */}
          {topRec && (
            <div className="relative overflow-hidden rounded-3xl bg-white border-3 border-amber-300/80 shadow-lg p-6 sm:p-7 hover:shadow-xl transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br ${topRec.game.bgGradient} flex items-center justify-center text-4xl sm:text-5xl shadow-md border-2 border-white ring-4 ring-amber-100 flex-shrink-0`}
                  >
                    {topRec.game.emoji}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider shadow-sm">
                        Top Pick for You
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                        {topRec.game.skillName}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        ⏱️ ~{topRec.game.estimatedMinutes} mins
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {t(topRec.game.titleKey) || topRec.game.titleKey}
                    </h4>

                    <p className="text-sm text-slate-600 font-medium max-w-xl">
                      {t(topRec.game.descKey) || topRec.game.descKey}
                    </p>

                    {/* Transparent Educational Rationale */}
                    <div className="inline-flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 rounded-2xl px-3.5 py-2 text-xs text-amber-900 font-medium mt-1">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>
                        <strong className="font-bold">Why this activity: </strong>
                        {topRec.reasonExplanation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 flex-shrink-0">
                  <div className="text-center sm:text-right lg:text-center">
                    <span className="text-xs font-bold text-slate-400 block uppercase">Rewards</span>
                    <span className="text-sm font-extrabold text-amber-600">
                      +{topRec.game.xpReward} XP • +3 ⭐
                    </span>
                  </div>
                  <button
                    onClick={() => setScreen(topRec.game.screenId)}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
                  >
                    <span>Play Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Recommendations Grid */}
          {secondaryRecs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryRecs.map((rec) => (
                <div
                  key={rec.game.id}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rec.game.bgGradient} flex items-center justify-center text-3xl shadow-sm border border-white flex-shrink-0`}
                    >
                      {rec.game.emoji}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                          {rec.game.skillName}
                        </span>
                        <span className="text-xs font-bold text-amber-600">
                          +{rec.game.xpReward} XP
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">
                        {t(rec.game.titleKey) || rec.game.titleKey}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {rec.reasonExplanation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      ⏱️ {rec.game.estimatedMinutes} mins
                    </span>
                    <button
                      onClick={() => setScreen(rec.game.screenId)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span>Play Activity</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Explore All Games Hub Card */}
        <div
          onClick={() => setScreen('game-hub')}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 p-6 sm:p-7 text-white shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                🎮
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">All Learning Games Hub</h3>
                <p className="text-sky-100 text-xs sm:text-sm font-medium">
                  Letter Match, Word Builder, Spell Quest, Read Aloud, Sound Builder & Story Explorer!
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScreen('game-hub');
              }}
              className="px-5 py-2.5 rounded-2xl bg-white text-indigo-950 font-black text-sm shadow-md hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
            >
              <Gamepad2 className="w-4 h-4 text-indigo-600" />
              <span>Explore All Games</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 3: Skill Superpowers & Live Growth */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800">
                  Your Learning Superpowers
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Watch your skills grow as you complete practice games!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {screeningIndicators.map((ind) => {
              const isStrong = ind.status === 'strong';
              const isDeveloping = ind.status === 'developing';

              return (
                <div
                  key={ind.skill}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{ind.skill}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isStrong
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDeveloping
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ind.score}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isStrong
                          ? 'bg-emerald-500'
                          : isDeveloping
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, ind.score)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Target: {ind.target}%</span>
                    <span className="capitalize font-semibold text-slate-600">
                      {ind.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Badges & Achievements */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Badges & Achievements
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Earn sparkling badges as you play more games and practice daily!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {BADGES.map((badge) => {
              const isUnlocked = gamification.unlockedBadgeIds?.includes(badge.id);
              return <BadgeCard key={badge.id} badge={badge} unlocked={isUnlocked} />;
            })}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setScreen('home')}
            className="px-6 py-3 rounded-2xl font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-sm flex items-center gap-2 text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Child Dashboard
          </button>
          <button
            onClick={() => setScreen('learning-profile')}
            className="px-6 py-3 rounded-2xl font-bold text-teal-800 bg-teal-100 hover:bg-teal-200 border border-teal-300 shadow-sm flex items-center gap-2 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Review Screening Profile
          </button>
        </div>
      </div>
    </div>
  );
};
