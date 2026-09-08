import React from 'react';
import {
  Sparkles,
  Flame,
  Trophy,
  Play,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { BADGES, LEARNING_GAMES, SCREENING_INDICATORS } from '../../data/mockData';
import { Button } from '../common/Button';
import { Mascot } from '../common/Mascot';

import type { LearningGame } from '../../types';

export const HomeDashboardScreen: React.FC = () => {
  const { t } = useLanguage();
  const { profile, avatar, gamification, setScreen, screeningIndicators } = useProfile();

  // Handle screening button click - Launches Core Dyslexia Screening Flow!
  const handleStartScreening = () => {
    setScreen('screening-intro');
  };

  // Handle learning game click - Routes directly to interactive games!
  const handlePlayGame = (gameId: string) => {
    if (gameId === 'bubble-pop') {
      setScreen('game-letter-match');
    } else if (gameId === 'rhyme-safari') {
      setScreen('game-read-aloud');
    } else if (gameId === 'mirror-magic') {
      setScreen('game-word-builder');
    } else {
      setScreen('learning-dashboard');
    }
  };

  // Recharts custom colors for screening indicators
  const getBarColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green (strong superpower)
    if (score >= 65) return '#F59E0B'; // Amber (developing well)
    return '#F43F5E'; // Rose (practice recommended)
  };

  // Chart data localized from dynamic screening indicators
  const indicatorsToDisplay = screeningIndicators && screeningIndicators.length > 0 ? screeningIndicators : SCREENING_INDICATORS;
  const chartData = indicatorsToDisplay.map((ind) => {
    let name = ind.skill;
    if (ind.skill === 'Phonemic Awareness') name = t('home.progressSection.phonemicAwareness');
    else if (ind.skill === 'Letter Recognition') name = t('home.progressSection.letterRecognition');
    else if (ind.skill === 'Visual Tracking') name = t('home.progressSection.visualTracking');
    else if (ind.skill === 'Sound Blending') name = t('home.progressSection.soundBlending');

    return {
      skill: name,
      score: ind.score,
      target: ind.target,
    };
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      {/* 1. Welcome Header Banner & Child Avatar Hero */}
      <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-4xl p-6 sm:p-8 text-white shadow-lg overflow-hidden">
        {/* Playful background decorative shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 text-center md:text-left">
            {/* Avatar Badge */}
            <div
              onClick={() => setScreen('profile-setup')}
              title="Click to change your avatar"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md border-3 border-white/40 flex items-center justify-center text-5xl sm:text-6xl shrink-0 shadow-inner cursor-pointer hover:scale-105 transition-transform group"
            >
              <span>{avatar.emoji}</span>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white text-amber-950 flex items-center justify-center font-bold text-xs shadow-sm">
                ⭐
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black tracking-wide uppercase mb-2">
                <span>{profile.grade}</span>
                <span>•</span>
                <span>{t(`avatars.${avatar.id}.role`) || avatar.role}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {t('home.greeting', { name: profile.name || 'Explorer' })}
              </h1>
              <p className="text-teal-100 font-medium text-sm sm:text-base mt-1 max-w-xl">
                {t('home.mascotCheer', { streak: gamification.streakDays })}
              </p>
            </div>
          </div>

          {/* Gamification Stats Island */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-3xl border border-white/30 text-slate-900 shrink-0">
            {/* XP Pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 text-amber-950 font-black shadow-sm">
              <Sparkles className="w-5 h-5 fill-amber-300 text-amber-800" />
              <div>
                <div className="text-[10px] uppercase font-bold opacity-80 leading-none">
                  {t('home.xpLabel')}
                </div>
                <div className="text-lg leading-tight">{gamification.xp}</div>
              </div>
            </div>

            {/* Level Pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-teal-900 font-black shadow-sm">
              <Trophy className="w-5 h-5 text-teal-600" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                  {t('home.levelLabel', { level: gamification.level })}
                </div>
                <div className="text-base leading-tight">
                  {t('home.levelTitle')}
                </div>
              </div>
            </div>

            {/* Daily Streak Pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500 text-white font-black shadow-sm">
              <Flame className="w-5 h-5 fill-white text-rose-200 animate-pulse" />
              <div>
                <div className="text-[10px] uppercase font-bold text-rose-200 leading-none">
                  {t('home.streakLabel')}
                </div>
                <div className="text-lg leading-tight">
                  {gamification.streakDays} Days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Giant Primary CTA: Start Screening Adventure */}
      <div className="relative bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 rounded-4xl p-6 sm:p-8 border-3 border-amber-300 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Mascot cheer */}
          <div className="flex items-center gap-5">
            <Mascot size="lg" expression="celebrating" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs tracking-wider uppercase mb-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                {t('home.screeningCard.badge')}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 mb-2">
                {t('home.screeningCard.title')}
              </h2>
              <p className="text-slate-700 text-sm sm:text-base font-medium max-w-xl leading-relaxed mb-3">
                {t('home.screeningCard.description')}
              </p>

              {/* Time & Mini-games pill */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-amber-900">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  {t('home.screeningCard.estimatedTime')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  {t('home.screeningCard.status')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full lg:w-auto shrink-0">
            <Button
              variant="primary"
              size="xl"
              soundType="success"
              onClick={handleStartScreening}
              rightIcon={<Play className="w-6 h-6 fill-amber-950" />}
              className="w-full lg:w-auto text-amber-950 font-black shadow-lg hover:scale-105"
            >
              {t('home.screeningCard.startBtn')}
            </Button>
          </div>
        </div>

        {/* Screening indicators disclaimer notice */}
        <div className="mt-5 pt-4 border-t border-amber-200/80 flex items-center gap-2 text-xs font-semibold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t('home.screeningCard.indicatorsNotice')}</span>
        </div>
      </div>

      {/* 3. Learning Progress & Screening Indicators (Recharts Visualization) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Screening Indicators Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {t('home.progressSection.title')}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {t('home.progressSection.subtitle')}
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Mock AI Screening Data
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="skill"
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} / 100`, t('home.progressSection.chartScoreLabel')]}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / Status Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs font-bold">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-900">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>{t('home.progressSection.strongStatus')} (80%+)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 text-amber-900">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span>{t('home.progressSection.developingStatus')} (65-79%)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-50 text-rose-900">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <span>{t('home.progressSection.supportStatus')} (&lt;65%)</span>
            </div>
          </div>
        </div>

        {/* Right Col: Explorer Companion Card */}
        <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-3xl p-6 border-2 border-indigo-200 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
                Active Buddy
              </span>
              <button
                onClick={() => setScreen('profile-setup')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Change Avatar
              </button>
            </div>

            <div className="text-center py-4">
              <div className="text-6xl sm:text-7xl mb-2 filter drop-shadow-md animate-bounce">
                {avatar.emoji}
              </div>
              <h4 className="text-xl font-black text-slate-900">
                {t(`avatars.${avatar.id}.name`) || avatar.name}
              </h4>
              <p className="text-xs font-bold text-indigo-600">
                {t(`avatars.${avatar.id}.role`) || avatar.role}
              </p>
              <p className="text-xs text-slate-600 mt-2 italic px-2">
                "{avatar.description}"
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-indigo-100 text-xs text-slate-700 font-semibold space-y-1">
            <div className="flex justify-between">
              <span>Next Level Unlock:</span>
              <strong className="text-indigo-600">Level 3 (300 XP)</strong>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (gamification.xp / 300) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Personalized Learning Games Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('home.gamesSection.title')}
            </h3>
            <p className="text-sm font-medium text-slate-500">
              {t('home.gamesSection.subtitle')}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setScreen('learning-dashboard')}
            rightIcon={<Sparkles className="w-4 h-4 text-amber-950" />}
            className="shadow-sm font-black"
          >
            Personalized Adventure Hub 🚀
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {LEARNING_GAMES.map((game: LearningGame) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                    {game.id === 'bubble-pop' && '🫧'}
                    {game.id === 'rhyme-safari' && '🦁'}
                    {game.id === 'mirror-magic' && '🪞'}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    +{game.xpReward} XP
                  </span>
                </div>

                <h4 className="text-lg font-black text-slate-900 mb-1">
                  {t(game.titleKey)}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                  {t(game.descKey)}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  ⏱️ {game.duration}
                </span>
                <Button
                  variant="teal"
                  size="sm"
                  soundType="pop"
                  onClick={() => handlePlayGame(game.id)}
                >
                  {t('home.gamesSection.playNow')} →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Badges & Trophies Showcase */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {t('home.badgesSection.title')}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              {t('home.badgesSection.subtitle')}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            2 Unlocked / 2 In Progress
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 border-2 flex flex-col justify-between transition-all ${
                badge.isUnlocked
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      badge.isUnlocked ? badge.color : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {badge.icon === 'Star' && '⭐'}
                    {badge.icon === 'Flame' && '🔥'}
                    {badge.icon === 'Zap' && '⚡'}
                    {badge.icon === 'Glasses' && '🔍'}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      badge.isUnlocked
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {badge.isUnlocked
                      ? t('home.badgesSection.unlocked')
                      : t('home.badgesSection.locked')}
                  </span>
                </div>

                <h5 className="font-extrabold text-sm text-slate-900 mb-0.5">
                  {t(badge.titleKey)}
                </h5>
                <p className="text-xs text-slate-600 leading-snug mb-3">
                  {t(badge.descKey)}
                </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {badge.progress} / {badge.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      badge.isUnlocked ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{
                      width: `${(badge.progress / badge.maxProgress) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
