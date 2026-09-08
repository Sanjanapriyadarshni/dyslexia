import React from 'react';
import { ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { Button } from '../common/Button';
import { Mascot } from '../common/Mascot';

export const SplashScreen: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const { setScreen } = useProfile();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
      {/* Top Tag & Decorative Elements */}
      <div className="w-full flex flex-col items-center text-center pt-2 md:pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 border-2 border-teal-300 text-teal-900 text-xs sm:text-sm font-black mb-6 shadow-sm animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{t('splash.subtitle')}</span>
        </div>

        {/* Mascot Centerstage */}
        <div className="my-2 sm:my-4">
          <Mascot
            size="xl"
            expression="waving"
            speechText={
              currentLanguage === 'ta'
                ? 'வணக்கம் குட்டீஸ்! அக்ஷுவுடன் விளையாடி புதிய வாசிப்பு ஆற்றல்களைக் கற்க வாருங்கள்!'
                : 'Welcome, young explorer! Ready to learn, play, and discover your reading superpowers?'
            }
          />
        </div>

        {/* Big AkshAI Brand Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 mt-4 mb-2">
          Aksh<span className="text-amber-500">AI</span>
        </h1>

        {/* Localized Tagline */}
        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-teal-700 tracking-wide mb-4">
          {t('splash.tagline')}
        </p>

        {/* Friendly Description */}
        <p className="max-w-2xl text-slate-600 text-base sm:text-lg font-medium leading-relaxed mb-6 sm:mb-8 px-4">
          {t('splash.description')}
        </p>

        {/* 3 Core Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mb-8">
          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border-2 border-amber-200/80 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold">
              🎮
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">{t('splash.feature1')}</h4>
              <p className="text-xs text-slate-500">Fun 10-min quests</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border-2 border-teal-200/80 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-800 shrink-0 font-bold">
              🇮🇳
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">{t('splash.feature2')}</h4>
              <p className="text-xs text-slate-500">Native Indian scripts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border-2 border-indigo-200/80 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-800 shrink-0 font-bold">
              🌟
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">{t('splash.feature3')}</h4>
              <p className="text-xs text-slate-500">Early screening indicators</p>
            </div>
          </div>
        </div>

        {/* Large Accessible Primary Action Button */}
        <div className="w-full max-w-md">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            soundType="success"
            rightIcon={<ArrowRight className="w-6 h-6" />}
            onClick={() => setScreen('language-select')}
            className="animate-wiggle-hover text-amber-950 font-black"
          >
            {t('splash.startBtn')}
          </Button>
        </div>
      </div>

      {/* Mandatory Non-Medical Screening Disclaimer Card */}
      <div className="w-full max-w-3xl mt-8 sm:mt-12 bg-amber-50/70 border-2 border-amber-300/80 rounded-3xl p-4 flex items-start gap-3 shadow-sm text-left">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed font-semibold">
          <span className="font-extrabold">{t('app.nonMedicalBadge')}</span>: {t('splash.disclaimer')}
        </div>
      </div>
    </div>
  );
};
