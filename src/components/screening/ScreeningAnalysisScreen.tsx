import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { Mascot } from '../common/Mascot';
import { soundEngine } from '../../hooks/useSound';

export const ScreeningAnalysisScreen: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const { setScreen } = useProfile();
  const { generateReport } = useScreening();

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t('screening.analysis.step1'),
    t('screening.analysis.step2'),
    t('screening.analysis.step3'),
  ];

  useEffect(() => {
    let isMounted = true;

    // Step 0: Initializing
    const timer1 = setTimeout(() => {
      if (isMounted) {
        setActiveStep(1);
        soundEngine.playPop();
      }
    }, 1200);

    const timer2 = setTimeout(() => {
      if (isMounted) {
        setActiveStep(2);
        soundEngine.playPop();
      }
    }, 2400);

    // Call service layer to calculate and save results
    generateReport(currentLanguage).then(() => {
      const timer3 = setTimeout(() => {
        if (isMounted) {
          soundEngine.playSuccess();
          setScreen('learning-profile');
        }
      }, 3400);
      return () => clearTimeout(timer3);
    });

    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentLanguage]);

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-2xl mx-auto p-6 md:p-12 flex flex-col items-center justify-center text-center">
      {/* Animated Mascot */}
      <div className="mb-6">
        <Mascot size="xl" expression="celebrating" />
      </div>

      {/* Main Analysis Title */}
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
        {t('screening.analysis.title')}
      </h2>
      <p className="text-sm font-semibold text-slate-500 mb-8 max-w-md">
        {t('screening.analysis.disclaimer')}
      </p>

      {/* Step by step calculation cards */}
      <div className="w-full space-y-3 max-w-md text-left mb-8">
        {steps.map((text, idx) => {
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : isCurrent
                  ? 'bg-teal-50 border-teal-400 text-teal-950 shadow-md scale-102 ring-4 ring-teal-100'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold leading-tight">
                {text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Non-Medical Disclaimer */}
      <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        <span>{t('app.nonMedicalBadge')}</span>
      </div>
    </div>
  );
};
