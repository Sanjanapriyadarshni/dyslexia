import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { getScreeningContent } from '../../screeningContent';
import { speakText, soundEngine } from '../../hooks/useSound';
import { Button } from '../common/Button';
import { AudioSpeaker } from '../common/AudioSpeaker';

export const ComprehensionTestScreen: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const { setScreen } = useProfile();
  const { recordComprehensionAnswer } = useScreening();

  const content = getScreeningContent(currentLanguage);
  const passage = content.comprehensionPassage;
  const questions = passage.questions;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = questions[currentQIndex] || questions[0];

  const handlePlayStory = () => {
    if (passage.audioPrompt) {
      speakText(passage.audioPrompt, currentLanguage);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;

    const isCorrect = optIdx === currentQ.correctIndex;
    setSelectedOption(optIdx);
    setIsAnswered(true);

    if (isCorrect) soundEngine.playSuccess();
    else soundEngine.playPop();

    recordComprehensionAnswer(currentQ.id, isCorrect);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Proceed to Screening Analysis screen!
      setScreen('screening-analysis');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-3xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('screening-spelling')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nav.back')}</span>
          </button>
          <span className="text-xs font-extrabold text-indigo-900 bg-indigo-100 px-3.5 py-1 rounded-full border border-indigo-300">
            {t('screening.comprehension.step')}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>
              Question {currentQIndex + 1} of {questions.length}
            </span>
            <span>
              {Math.round(((currentQIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Story Passage Card */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white rounded-3xl p-6 sm:p-7 border-2 border-indigo-200 shadow-sm mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <h3 className="text-lg sm:text-xl font-black text-indigo-950">
                {passage.title}
              </h3>
            </div>
            <AudioSpeaker
              size="sm"
              label={t('screening.comprehension.listenStory')}
              onPlay={handlePlayStory}
            />
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed bg-white/80 p-4 rounded-2xl border border-indigo-100">
            "{passage.story}"
          </p>
        </div>

        {/* Question & Options */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-sm mb-6 text-left">
          <h4 className="text-lg font-black text-slate-900 mb-4">
            Q{currentQIndex + 1}: {currentQ.question}
          </h4>

          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let styles = 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50';

              if (isAnswered) {
                if (isSelected) {
                  styles = 'bg-teal-50 border-teal-500 ring-4 ring-teal-100 font-bold';
                } else {
                  styles = 'bg-slate-50 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  type="button"
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-bold text-slate-800 flex items-center justify-between transition-all select-none cursor-pointer ${styles}`}
                >
                  <span>{option}</span>
                  {isSelected && isAnswered && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!isAnswered}
          onClick={handleNextQuestion}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="min-w-[240px]"
        >
          {currentQIndex < questions.length - 1
            ? t('screening.comprehension.nextQuestion')
            : t('screening.comprehension.finishBtn')}
        </Button>
      </div>
    </div>
  );
};
