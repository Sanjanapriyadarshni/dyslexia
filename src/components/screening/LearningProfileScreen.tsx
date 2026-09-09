import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  Home,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { Button } from '../common/Button';

export const LearningProfileScreen: React.FC = () => {
  const { t } = useLanguage();
  const { profile, avatar, setScreen, applyScreeningScores, userRole } = useProfile();
  const { screeningReport } = useScreening();

  // Fallback scores if report wasn't generated
  const scores = screeningReport?.scores || {
    letterRecognition: 86,
    readingAccuracy: 72,
    spelling: 64,
    comprehension: 81,
    overallScore: 76,
  };

  const strengths = screeningReport?.strengths || [
    'Letter Recognition & Visual Discernment',
    'Story Comprehension & Active Listening',
  ];

  const practiceAreas = screeningReport?.practiceAreas || [
    'Reading Fluency & Complex Consonant Blends',
    'Phonetic Spelling & Syllable Encoding',
  ];

  const handleStartLearning = () => {
    // Apply scores to dashboard indicators and award XP!
    applyScreeningScores(scores);
    setScreen('learning-dashboard');
  };

  const handleViewProgress = () => {
    applyScreeningScores(scores);
    setScreen('home');
  };

  const skillCards = [
    {
      id: 'letter',
      label: t('screening.profile.skills.letter'),
      score: scores.letterRecognition,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
      emoji: '🔤',
    },
    {
      id: 'reading',
      label: t('screening.profile.skills.reading'),
      score: scores.readingAccuracy,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      barColor: 'bg-teal-500',
      emoji: '📖',
    },
    {
      id: 'spelling',
      label: t('screening.profile.skills.spelling'),
      score: scores.spelling,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      barColor: 'bg-rose-500',
      emoji: '✏️',
    },
    {
      id: 'comprehension',
      label: t('screening.profile.skills.comprehension'),
      score: scores.comprehension,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      barColor: 'bg-indigo-600',
      emoji: '💡',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      {/* 1. Header Banner & Celebration */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-indigo-800 rounded-4xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden text-center sm:text-left">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border-3 border-white/40 flex items-center justify-center text-6xl shrink-0 shadow-inner">
              {avatar.emoji}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase mb-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                Screening Completed
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {profile.name}'s {t('screening.profile.title')}
              </h1>
              <p className="text-teal-100 text-sm sm:text-base font-medium max-w-xl mt-1">
                {t('screening.profile.subtitle')}
              </p>
            </div>
          </div>

          {/* Overall Indicator Gauge */}
          <div className="flex flex-col items-center justify-center bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/30 text-center min-w-[140px]">
            <span className="text-[11px] font-extrabold uppercase text-teal-200">
              Overall Readiness
            </span>
            <span className="text-4xl font-black text-amber-300 my-1">
              {scores.overallScore}%
            </span>
            <span className="text-[10px] font-bold text-white/80">
              Indicative Marker
            </span>
          </div>
        </div>
      </div>

      {/* 2. 4 Skill Cards Grid */}
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
          Activity Skill Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCards.map((skill) => (
            <div
              key={skill.id}
              className={`rounded-3xl p-5 border-2 shadow-sm bg-white flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{skill.emoji}</span>
                  <span className="text-2xl font-black text-slate-800">
                    {skill.score}%
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  {skill.label}
                </h4>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden my-3">
                  <div
                    className={`h-2.5 rounded-full ${skill.barColor} transition-all duration-500`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-500">
                {skill.score >= 75 ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-extrabold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Superpower
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1 font-extrabold">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Practice Recommended
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Strengths vs Practice Areas Two-Pillar Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar A: Strengths */}
        <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-950 font-black text-lg mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
              ✓
            </span>
            <span>{t('screening.profile.strengthsTitle')}</span>
          </div>
          <div className="space-y-3">
            {strengths.map((str, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex items-start gap-3 shadow-xs"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-bold text-slate-800 leading-snug">
                  {str}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar B: Practice Areas */}
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-950 font-black text-lg mb-4">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-sm">
              →
            </span>
            <span>{t('screening.profile.practiceTitle')}</span>
          </div>
          <div className="space-y-3">
            {practiceAreas.map((area, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-start gap-3 shadow-xs"
              >
                <ArrowRight className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-sm font-bold text-slate-800 leading-snug">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Mandatory Non-Medical Disclaimer & Indicative Summary Banner */}
      <div className="bg-amber-100/60 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-2 text-left">
        <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Indicative Screening Notice (Non-Medical)</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
          {t('screening.profile.indicativeSummary')}
        </p>
        <p className="text-xs font-semibold text-amber-900/90 leading-relaxed">
          {t('screening.profile.disclaimer')}
        </p>
      </div>

      {/* 5. Primary and Secondary Action CTAs */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="primary"
          size="xl"
          soundType="success"
          onClick={handleStartLearning}
          rightIcon={<Sparkles className="w-6 h-6" />}
          className="w-full sm:w-auto min-w-[280px] shadow-lg hover:scale-105"
        >
          {t('screening.profile.startPersonalizedBtn')}
        </Button>

        {userRole === 'parent' && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setScreen('parent-dashboard')}
            className="w-full sm:w-auto text-indigo-800 bg-indigo-100 hover:bg-indigo-200 font-extrabold"
          >
            ← {t('parent.nav.overview') || 'Back to Parent Dashboard'}
          </Button>
        )}
      </div>
    </div>
  );
};
