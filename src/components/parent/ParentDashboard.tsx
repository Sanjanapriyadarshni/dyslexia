import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Flame,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  ChevronRight,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  UserCheck,
  Gamepad2,
  ExternalLink,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import { useScreening } from '../../context/ScreeningContext';
import { generateWeeklyProgress, calculateSkillOverview, getParentRecommendations } from '../../services';
import { BADGES } from '../../data/mockData';

export const ParentDashboard: React.FC = () => {
  const {
    profile,
    avatar,
    gamification,
    screeningIndicators,
    recentActivities,
    learningTime,
    setScreen,
    setUserRole,
  } = useProfile();
  const { t, languageConfig } = useLanguage();
  const { screeningReport } = useScreening();

  const [activeChartMetric, setActiveChartMetric] = useState<
    'all' | 'reading' | 'spelling' | 'comprehension' | 'time'
  >('all');

  // Compute live 7-day progress data
  const weeklyData = generateWeeklyProgress(screeningIndicators, gamification.streakDays);

  // Compute skill overview deltas
  const skillOverview = calculateSkillOverview(screeningIndicators);

  // Compute parent tips based on live indicators
  const parentTips = getParentRecommendations(screeningIndicators);

  // Derived metrics
  const readingScore =
    screeningIndicators.find((i) =>
      i.skill.toLowerCase().includes('reading') || i.skill.toLowerCase().includes('phonemic')
    )?.score ?? 74;

  const spellingScore =
    screeningIndicators.find((i) =>
      i.skill.toLowerCase().includes('spelling') || i.skill.toLowerCase().includes('sound blending')
    )?.score ?? 64;

  const letterScore =
    screeningIndicators.find((i) =>
      i.skill.toLowerCase().includes('letter')
    )?.score ?? 86;

  const compScore =
    screeningIndicators.find((i) =>
      i.skill.toLowerCase().includes('comprehension') || i.skill.toLowerCase().includes('visual')
    )?.score ?? 78;

  const overallScore = Math.round(
    (readingScore + spellingScore + letterScore + compScore) / 4
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner & Child Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Title & Child Summary */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-teal-500 to-indigo-500 p-1 flex items-center justify-center text-3xl sm:text-4xl shadow-lg flex-shrink-0">
              <span className="bg-slate-900/40 w-full h-full rounded-[22px] flex items-center justify-center">
                {avatar.emoji}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  {t('parent.header.badge') || 'Parent Oversight View'}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {profile.grade} • {profile.age} {t('profile.ageUnit') || 'years'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{profile.name || 'Aarav'}</span>
                <span className="text-slate-400 font-normal text-lg sm:text-xl">
                  {t('parent.header.learningJourney') || "'s Learning Journey"}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {t('parent.header.subtitle') ||
                  'Monitoring reading progress, screening indicators, and at-home practice routines.'}
              </p>
            </div>
          </div>

          {/* Right: Quick HUD Indicators & Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-sm">
                ⭐
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  {t('home.levelLabel', { level: gamification.level }) || `Level ${gamification.level}`}
                </div>
                <div className="text-sm font-black text-white">{gamification.xp} XP</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black text-sm">
                🔥
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  {t('home.streakLabel') || 'Streak'}
                </div>
                <div className="text-sm font-black text-white">
                  {gamification.streakDays} {t('parent.streakUnit') || 'Days'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setUserRole('child')}
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
            >
              <span>👦</span>
              <span>{t('parent.header.switchToChild') || 'Enter Child Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Parent Overview Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>{t('parent.overview.title') || 'Learning Performance Overview'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t('parent.overview.subtitle') ||
                'Non-medical screening indicators and observed skill mastery based on interactive quests'}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            {t('app.nonMedicalBadge') || 'Non-Medical Indicators'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Overall */}
          <div className="col-span-2 md:col-span-1 bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{t('parent.overview.overall') || 'Overall Readiness'}</span>
              <span className="text-lg">🎯</span>
            </div>
            <div className="my-3">
              <div className="text-3xl font-black text-indigo-950">{overallScore}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block w-fit">
              +7% {t('parent.overview.thisWeek') || 'this week'}
            </span>
          </div>

          {/* Card 2: Reading */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{t('parent.overview.reading') || 'Reading Fluency'}</span>
              <span className="text-lg">🎤</span>
            </div>
            <div className="my-3">
              <div className="text-3xl font-black text-slate-900">{readingScore}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readingScore}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block w-fit">
              +6% {t('parent.overview.thisWeek') || 'this week'}
            </span>
          </div>

          {/* Card 3: Spelling */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{t('parent.overview.spelling') || 'Phonetic Spelling'}</span>
              <span className="text-lg">✍️</span>
            </div>
            <div className="my-3">
              <div className="text-3xl font-black text-slate-900">{spellingScore}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${spellingScore}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block w-fit">
              +9% {t('parent.overview.thisWeek') || 'this week'}
            </span>
          </div>

          {/* Card 4: Letter Recognition */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{t('parent.overview.letter') || 'Letter Recognition'}</span>
              <span className="text-lg">🔤</span>
            </div>
            <div className="my-3">
              <div className="text-3xl font-black text-slate-900">{letterScore}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${letterScore}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block w-fit">
              +4% {t('parent.overview.thisWeek') || 'this week'}
            </span>
          </div>

          {/* Card 5: Comprehension */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{t('parent.overview.comprehension') || 'Comprehension'}</span>
              <span className="text-lg">📖</span>
            </div>
            <div className="my-3">
              <div className="text-3xl font-black text-slate-900">{compScore}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${compScore}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md inline-block w-fit">
              +5% {t('parent.overview.thisWeek') || 'this week'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Latest Screening Summary Card with Mandatory Non-Medical Notice */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 rounded-3xl p-6 border-2 border-amber-200/80 shadow-xs relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500 text-amber-950 flex items-center gap-1 shadow-xs">
                <span>📑</span>
                <span>{t('parent.screening.sectionTag') || 'Latest Screening Assessment'}</span>
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {screeningReport
                    ? new Date(screeningReport.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'September 2026'}
                </span>
              </span>
              <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                {languageConfig.name}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900">
              {t('parent.screening.title') || 'Comprehensive Foundational Literacy Check-In'}
            </h3>

            {/* Non-Medical Notice - Explicit Requirement */}
            <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs font-medium text-amber-950 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="font-black">{t('parent.screening.noticeTitle') || 'Important Non-Medical Notice: '}</strong>
                {t('parent.screening.noticeBody') ||
                  "This screening provides learning indicators and is not a medical diagnosis. If you have concerns about your child's development, consult a qualified professional."}
              </p>
            </div>

            {/* Strengths & Focus Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                <div className="text-xs font-black text-emerald-800 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('parent.screening.strengths') || 'Demonstrated Strengths'}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {screeningReport?.strengths?.length
                    ? screeningReport.strengths.join(', ')
                    : 'Visual pattern recognition, Letter identification, Story curiosity'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                <div className="text-xs font-black text-amber-800 flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('parent.screening.focusAreas') || 'Areas for Growth & Practice'}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {screeningReport?.practiceAreas?.length
                    ? screeningReport.practiceAreas.join(', ')
                    : 'Phonetic blending, Complex vowel spellings, Reading pace'}
                </div>
              </div>
            </div>
          </div>

          {/* Action to view full learning profile */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
            <button
              onClick={() => setScreen('learning-profile')}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('parent.screening.viewFullBtn') || 'View Full Learning Profile'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setScreen('screening-intro')}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🔄</span>
              <span>{t('parent.screening.retakeBtn') || 'Take New Screening'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Weekly Progress Chart & Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts 7-Day Progress */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <span>{t('parent.chart.title') || 'Weekly Progress Over Time'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {t('parent.chart.subtitle') || 'Last 7 days skill progression ending in today’s live indicator'}
              </p>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto max-w-full">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'reading', label: 'Reading' },
                  { id: 'spelling', label: 'Spelling' },
                  { id: 'comprehension', label: 'Story' },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveChartMetric(btn.id)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    activeChartMetric === btn.id
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="readingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="spellingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[30, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '1rem',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                {(activeChartMetric === 'all' || activeChartMetric === 'reading') && (
                  <Area
                    type="monotone"
                    dataKey="reading"
                    name="Reading"
                    stroke="#0D9488"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#readingGrad)"
                  />
                )}
                {(activeChartMetric === 'all' || activeChartMetric === 'spelling') && (
                  <Area
                    type="monotone"
                    dataKey="spelling"
                    name="Spelling"
                    stroke="#F43F5E"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#spellingGrad)"
                  />
                )}
                {(activeChartMetric === 'all' || activeChartMetric === 'comprehension') && (
                  <Area
                    type="monotone"
                    dataKey="comprehension"
                    name="Comprehension"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#compGrad)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-500 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" /> Reading Fluency
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Spelling
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Comprehension
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Data auto-updates upon game completion
            </span>
          </div>
        </div>

        {/* Right 1 Col: Skills Breakdown with Delta % */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-1">
              {t('parent.skills.title') || 'Skills Overview'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {t('parent.skills.subtitle') || 'Recent rate of skill development'}
            </p>

            <div className="space-y-4">
              {skillOverview.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800 font-black">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-black text-xs">
                        +{item.changePercent}%
                      </span>
                      <span className="text-slate-900 font-black text-sm">{item.score}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.score >= 80
                          ? 'bg-emerald-500'
                          : item.score >= 65
                          ? 'bg-teal-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-medium flex items-center gap-2">
            <Heart className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>Spelling showed highest weekly gain (+9%)!</span>
          </div>
        </div>
      </div>

      {/* 5. How You Can Help (At Home Recommendations) & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: How You Can Help */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏡</span>
              <h3 className="text-xl font-black text-slate-900">
                {t('parent.help.title') || 'How You Can Help (At Home)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('parent.help.subtitle') ||
                'Practical, stress-free reading routines tailored to your child’s current focus areas'}
            </p>
          </div>

          <div className="space-y-3">
            {parentTips.map((tip) => (
              <div
                key={tip.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
                  {tip.category === 'reading'
                    ? '📖'
                    : tip.category === 'spelling'
                    ? '🧩'
                    : tip.category === 'comprehension'
                    ? '💬'
                    : '🌱'}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-900">{tip.title}</h4>
                    {tip.priority === 'high' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0">
                        Top Tip
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip.description}</p>
                  <div className="text-[11px] font-bold text-teal-700 pt-1 flex items-center gap-1">
                    <span>Suggested Quest:</span>
                    <span className="underline">{tip.suggestedAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Activity Log */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span>{t('parent.activity.title') || 'Recent Learning Activity'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {t('parent.activity.subtitle') || 'Live log of games and screening quests completed'}
                </p>
              </div>

              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {recentActivities.length} {t('parent.activity.activitiesCount') || 'logged'}
              </span>
            </div>

            <div className="space-y-2.5">
              {recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xl flex-shrink-0">
                      {act.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate">{act.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="text-teal-700 font-bold">{act.skillPracticed}</span>
                        <span>•</span>
                        <span>{t(act.relativeTimeKey) || 'Today'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      +{act.xpEarned} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setScreen('learning-dashboard')}
              className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('parent.activity.launchGameBtn') || 'Play A Learning Game Together'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">XP and stars synced</span>
          </div>
        </div>
      </div>

      {/* 6. Learning Time & Badges Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Time Statistics Cards */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs">
          <h3 className="text-xl font-black text-slate-900 mb-1">
            {t('parent.time.title') || 'Learning Time & Habits'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {t('parent.time.subtitle') || 'Daily practice frequency and streak persistence'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Today's Time</span>
              </div>
              <div className="text-2xl font-black text-teal-950">{learningTime.today} mins</div>
              <div className="text-[10px] text-teal-700 mt-1 font-semibold">Recommended: 15-20 mins</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>This Week</span>
              </div>
              <div className="text-2xl font-black text-indigo-950">
                {Math.floor(learningTime.weekly / 60)}h {learningTime.weekly % 60}m
              </div>
              <div className="text-[10px] text-indigo-700 mt-1 font-semibold">Active learner</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Current Streak</span>
              </div>
              <div className="text-2xl font-black text-rose-950">{gamification.streakDays} Days</div>
              <div className="text-[10px] text-rose-700 mt-1 font-semibold">Consistent habit!</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Completed</span>
              </div>
              <div className="text-2xl font-black text-amber-950">
                {gamification.completedQuests} Quests
              </div>
              <div className="text-[10px] text-amber-700 mt-1 font-semibold">
                {gamification.stars} Stars collected
              </div>
            </div>
          </div>
        </div>

        {/* Badges & Achievements Showcase */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{t('parent.badges.title') || 'Badges & Milestones'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {t('parent.badges.subtitle') || 'Positive reinforcement celebrating bravery and milestones'}
              </p>
            </div>

            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {gamification.unlockedBadgeIds.length} / {BADGES.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES.map((badge) => {
              const isUnlocked = gamification.unlockedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-white to-amber-50/40 border-amber-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-1.5 flex items-center justify-center">
                    {badge.icon}
                  </div>
                  <div className="text-xs font-black text-slate-900 truncate">
                    {t(badge.titleKey) || badge.titleKey}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                    {t(badge.descKey) || badge.descKey}
                  </div>
                  <div className="mt-2 text-[10px] font-bold">
                    {isUnlocked ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Earned
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                        🔒 In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. Bottom Action Bar */}
      <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Quick Actions for Parents:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setScreen('learning-profile')}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 text-slate-800 transition-colors cursor-pointer"
          >
            📑 View Learning Profile
          </button>
          <button
            onClick={() => setScreen('learning-dashboard')}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 text-slate-800 transition-colors cursor-pointer"
          >
            🎮 Practice Recommendations
          </button>
          <button
            onClick={() => setScreen('language-select')}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 text-slate-800 transition-colors cursor-pointer"
          >
            🌐 Change Language ({languageConfig.name})
          </button>
        </div>
      </div>
    </div>
  );
};
