import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { getScreeningContent } from '../../screeningContent';
import { evaluateSpelling } from '../../services/screeningService';
import { speakText, soundEngine } from '../../hooks/useSound';
import { Button } from '../common/Button';
import { AudioSpeaker } from '../common/AudioSpeaker';

export const SpellingTestScreen: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const { setScreen } = useProfile();
  const { recordSpellingAnswer } = useScreening();

  const content = getScreeningContent(currentLanguage);
  const questions = content.spellingQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    setTypedInput('');
    setIsSubmitted(false);
    setFeedback(null);
    // Auto-play word prompt when new question mounts
    const timer = setTimeout(() => {
      speakText(currentQ.audioPrompt, currentLanguage);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex, currentQ.audioPrompt, currentLanguage]);

  const handlePlayAudio = () => {
    speakText(currentQ.audioPrompt, currentLanguage);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedInput.trim() || isSubmitted) return;

    const evaluation = evaluateSpelling(typedInput, currentQ.word);
    setIsSubmitted(true);

    if (evaluation.isCorrect) {
      soundEngine.playSuccess();
      setFeedback({
        isCorrect: true,
        text: t('screening.spelling.correctFeedback'),
      });
    } else {
      soundEngine.playPop();
      setFeedback({
        isCorrect: false,
        text: `${t('screening.spelling.gentleFeedback')} (Target word was: "${currentQ.word}")`,
      });
    }

    recordSpellingAnswer(currentQ.id, evaluation.isCorrect, typedInput.trim());
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Proceed to Comprehension Test
      setScreen('screening-comprehension');
    }
  };

  const progressPercentage = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-3xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('screening-reading')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nav.back')}</span>
          </button>
          <span className="text-xs font-extrabold text-rose-900 bg-rose-100 px-3.5 py-1 rounded-full border border-rose-300">
            {t('screening.spelling.step')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-rose-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm text-center mb-6">
          <p className="text-base sm:text-lg font-black text-slate-800 mb-2">
            {t('screening.spelling.instruction')}
          </p>
          <p className="text-xs text-slate-500 font-semibold mb-6">
            Hint: {currentQ.hint}
          </p>

          {/* Large Interactive Speaker Action */}
          <div className="inline-flex flex-col items-center justify-center p-6 bg-rose-50/70 border-3 border-rose-200 rounded-4xl my-2 min-w-[180px]">
            <span className="text-5xl mb-2">🎧</span>
            <AudioSpeaker
              size="lg"
              label={t('screening.spelling.listenWord')}
              onPlay={handlePlayAudio}
            />
            <span className="text-xs font-black text-rose-900 mt-2">
              {t('screening.spelling.listenWord')}
            </span>
          </div>

          {/* Typing Form */}
          <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto space-y-4">
            <input
              type="text"
              autoFocus
              value={typedInput}
              disabled={isSubmitted}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={t('screening.spelling.inputPlaceholder')}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-3 border-slate-200 text-slate-900 font-black text-2xl text-center tracking-widest focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
            />

            {!isSubmitted && (
              <Button
                type="submit"
                variant="coral"
                size="md"
                fullWidth
                disabled={!typedInput.trim()}
              >
                {t('screening.spelling.submitBtn')}
              </Button>
            )}
          </form>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`mt-6 p-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-2 animate-fade-in ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!isSubmitted}
          onClick={handleNext}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="min-w-[220px]"
        >
          {currentIndex < questions.length - 1
            ? t('screening.spelling.nextBtn')
            : t('screening.spelling.finishBtn')}
        </Button>
      </div>
    </div>
  );
};
