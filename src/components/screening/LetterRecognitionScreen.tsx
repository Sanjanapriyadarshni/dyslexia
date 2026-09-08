import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { getScreeningContent } from '../../screeningContent';
import { speakText, soundEngine } from '../../hooks/useSound';
import { Button } from '../common/Button';
import { AudioSpeaker } from '../common/AudioSpeaker';

export const LetterRecognitionScreen: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const { setScreen } = useProfile();
  const { recordLetterAnswer } = useScreening();

  const content = getScreeningContent(currentLanguage);
  const questions = content.letterQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    startTimeRef.current = Date.now();
    setSelectedIndex(null);
    setIsAnswered(false);
    setFeedback(null);
  }, [currentIndex]);

  const handlePlayAudio = () => {
    speakText(currentQ.audioPronunciation, currentLanguage);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    const responseTime = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const isCorrect = idx === currentQ.correctIndex;

    setSelectedIndex(idx);
    setIsAnswered(true);

    if (isCorrect) {
      soundEngine.playSuccess();
      setFeedback({
        isCorrect: true,
        text: currentQ.explanation || t('screening.letter.correctFeedback'),
      });
    } else {
      soundEngine.playPop();
      setFeedback({
        isCorrect: false,
        text: currentQ.explanation || t('screening.letter.gentleFeedback'),
      });
    }

    // Record response in screening context
    recordLetterAnswer(currentQ.id, isCorrect, responseTime);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Proceed to Reading Test
      setScreen('screening-reading');
    }
  };

  const progressPercentage = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-3xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Top Header: Navigation & Progress */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('screening-intro')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nav.back')}</span>
          </button>
          <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
            {t('screening.letter.step')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>
              {t('screening.letter.progress', {
                current: currentIndex + 1,
                total: questions.length,
              })}
            </span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-amber-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm text-center mb-6">
          <p className="text-base sm:text-lg font-black text-slate-800 mb-4">
            {currentQ.prompt}
          </p>

          {/* Large Target Letter & Audio Button */}
          <div className="inline-flex flex-col items-center justify-center p-6 bg-amber-50/70 border-3 border-amber-300 rounded-4xl shadow-inner my-2 min-w-[160px]">
            <span className="text-7xl sm:text-8xl font-black text-amber-950 tracking-wide select-none drop-shadow-sm font-sans">
              {currentQ.targetLetter}
            </span>
            <div className="mt-3">
              <AudioSpeaker
                size="md"
                label={t('screening.letter.listenLetter')}
                onPlay={handlePlayAudio}
              />
            </div>
          </div>

          <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-wider">
            {t('screening.letter.chooseLetter')}
          </p>

          {/* Multiple Choice Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-3 max-w-xl mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedIndex === idx;

              let cardStyles =
                'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 hover:scale-105';
              if (isAnswered) {
                if (isChosen) {
                  cardStyles = 'bg-teal-50 border-teal-500 ring-4 ring-teal-200 shadow-md scale-105';
                } else {
                  cardStyles = 'bg-slate-50 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  type="button"
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`py-5 rounded-3xl border-3 text-4xl sm:text-5xl font-black text-slate-900 transition-all cursor-pointer select-none shadow-sm flex items-center justify-center min-h-[90px] ${cardStyles}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Gentle Feedback Banner */}
          {feedback && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-sm font-bold flex items-center justify-center gap-2 animate-fade-in">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 flex items-center justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!isAnswered}
          onClick={handleNext}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="min-w-[200px]"
        >
          {currentIndex < questions.length - 1
            ? t('screening.letter.nextBtn')
            : t('screening.letter.finishBtn')}
        </Button>
      </div>
    </div>
  );
};
