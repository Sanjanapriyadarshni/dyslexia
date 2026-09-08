import { ArrowLeft, ArrowRight, Clock, Mic, ShieldAlert, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { Button } from '../common/Button';
import { Mascot } from '../common/Mascot';

export const ScreeningIntroScreen: React.FC = () => {
  const { t } = useLanguage();
  const { setScreen } = useProfile();
  const { resetScreeningSession } = useScreening();

  const handleStart = () => {
    resetScreeningSession();
    setScreen('screening-letter');
  };

  const activities = [
    {
      num: '1',
      titleKey: 'screening.intro.overviewLetter',
      descKey: 'screening.intro.overviewLetterDesc',
      emoji: '🔍',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      num: '2',
      titleKey: 'screening.intro.overviewReading',
      descKey: 'screening.intro.overviewReadingDesc',
      emoji: '🎙️',
      color: 'bg-teal-100 text-teal-900 border-teal-300',
    },
    {
      num: '3',
      titleKey: 'screening.intro.overviewSpelling',
      descKey: 'screening.intro.overviewSpellingDesc',
      emoji: '✏️',
      color: 'bg-rose-100 text-rose-900 border-rose-300',
    },
    {
      num: '4',
      titleKey: 'screening.intro.overviewComp',
      descKey: 'screening.intro.overviewCompDesc',
      emoji: '📖',
      color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Top Exit Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('home')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('nav.back')}</span>
          </button>
          <span className="text-xs font-bold text-teal-900 bg-teal-100 px-3.5 py-1 rounded-full border border-teal-300">
            {t('app.nonMedicalBadge')}
          </span>
        </div>

        {/* Mascot Centerstage */}
        <div className="flex flex-col items-center text-center my-4">
          <Mascot
            size="lg"
            expression="waving"
            speechText={t('screening.intro.mascotCheer')}
            className="mb-3"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            {t('screening.intro.title')}
          </h1>
          <p className="max-w-2xl text-slate-600 text-base sm:text-lg font-medium leading-relaxed mb-6">
            {t('screening.intro.subtitle')}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 text-sm font-black shadow-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t('screening.intro.timeEstimate')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 border-2 border-teal-200 text-teal-950 text-sm font-black shadow-sm">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>{t('screening.intro.activitiesCount')}</span>
            </div>
          </div>
        </div>

        {/* 4 Activities Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {activities.map((act) => (
            <div
              key={act.num}
              className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm text-left"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 border ${act.color}`}
              >
                {act.emoji}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400">Step {act.num}</div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {t(act.titleKey)}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {t(act.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Microphone Notice Card */}
        <div className="bg-teal-50/80 border-2 border-teal-200 rounded-2xl p-4 flex items-start gap-3 text-left mb-6 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-sm text-teal-950">
              Microphone Friendly Quest
            </h5>
            <p className="text-xs font-semibold text-teal-800 leading-relaxed mt-0.5">
              {t('screening.intro.micPermission')}
            </p>
          </div>
        </div>
      </div>

      {/* Start Button & Non-medical notice */}
      <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-col items-center gap-3">
        <Button
          variant="primary"
          size="xl"
          soundType="success"
          onClick={handleStart}
          rightIcon={<ArrowRight className="w-6 h-6" />}
          className="w-full max-w-md text-amber-950 font-black shadow-lg hover:scale-105"
        >
          {t('screening.intro.startBtn')}
        </Button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t('splash.disclaimer')}</span>
        </div>
      </div>
    </div>
  );
};
