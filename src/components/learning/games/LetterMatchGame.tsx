import React, { useState } from 'react';
import { ArrowLeft, Volume2, HelpCircle, Check, RotateCcw, Star, Zap } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { validateMultipleChoiceAnswer } from '../../../services/answerValidationService';
import { RewardModal } from '../../gamification';

interface QuestionState {
  attempts: number;
  isAnswered: boolean;
  isCorrect: boolean;
  xpAwarded: boolean;
  selectedOption: number | null;
}

export const LetterMatchGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, addXP, addStars, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.letterMatch;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [showHint, setShowHint] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Rewards modal state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<GameCompletionResult | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const currentState: QuestionState = questionStates[currentIndex] || {
    attempts: 0,
    isAnswered: false,
    isCorrect: false,
    xpAwarded: false,
    selectedOption: null,
  };

  const handlePlayAudio = () => {
    soundEngine.playPop();
    speakText(currentQ.audioPronunciation, currentLanguage);
  };

  const handleSelectOption = (index: number) => {
    // If already correctly answered this question, do nothing
    if (currentState.isCorrect) return;

    const validation = validateMultipleChoiceAnswer(index, currentQ.correctIndex, currentLanguage);

    if (validation.isCorrect) {
      soundEngine.playSuccess();
      const shouldAward = !currentState.xpAwarded;
      if (shouldAward) {
        addXP(10);
        addStars(1);
      }

      setQuestionStates((prev) => ({
        ...prev,
        [currentIndex]: {
          attempts: (prev[currentIndex]?.attempts || 0) + 1,
          isAnswered: true,
          isCorrect: true,
          xpAwarded: true,
          selectedOption: index,
        },
      }));
      setFeedbackMessage(validation.feedback);
    } else {
      // Wrong answer
      soundEngine.playIncorrect();
      setShowHint(true);

      setQuestionStates((prev) => ({
        ...prev,
        [currentIndex]: {
          attempts: (prev[currentIndex]?.attempts || 0) + 1,
          isAnswered: false, // NOT marked completed
          isCorrect: false,
          xpAwarded: prev[currentIndex]?.xpAwarded || false,
          selectedOption: index,
        },
      }));
      setFeedbackMessage(validation.feedback);
    }
  };

  const handleTryAgain = () => {
    soundEngine.playPop();
    setQuestionStates((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        selectedOption: null,
        isCorrect: false,
        isAnswered: false,
      },
    }));
    setFeedbackMessage(null);
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowHint(false);
      setFeedbackMessage(null);
    } else {
      // Completed game
      const result = completeGame('letter-match', 10, 2);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setQuestionStates({});
    setShowHint(false);
    setFeedbackMessage(null);
    setShowRewardModal(false);
    setCompletionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-teal-50/50 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-amber-200 shadow-sm">
          <button
            onClick={() => setScreen('learning-dashboard')}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Adventure Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🔤</span>
            <span className="font-black text-slate-800 text-base sm:text-lg">Letter Match</span>
          </div>

          <div className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Game Main Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-200 shadow-xl space-y-6 text-center">
          {/* Target Prompt Box */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <span>Find the Target Letter</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              {currentQ.prompt}
            </h2>

            {/* Target Letter Showcase with Speaker */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-6xl shadow-lg ring-8 ring-amber-100 border-2 border-white select-none">
                {currentQ.targetLetter}
              </div>
              <button
                onClick={handlePlayAudio}
                className="p-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-sm active:scale-95 transition-all cursor-pointer"
                title="Hear target letter sound"
              >
                <Volume2 className="w-6 h-6 animate-pulse" />
              </button>
            </div>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = currentState.selectedOption === idx;

              let buttonStyle = 'bg-slate-50 border-slate-300 hover:bg-amber-50 hover:border-amber-400 text-slate-800';

              if (isSelected) {
                if (currentState.isCorrect) {
                  buttonStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200 scale-105 shadow-emerald-200';
                } else {
                  buttonStyle = 'bg-rose-100 border-rose-400 text-rose-900 ring-4 ring-rose-200 shadow-rose-200 animate-shake';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={currentState.isCorrect}
                  className={`h-24 sm:h-28 rounded-3xl border-3 text-4xl sm:text-5xl font-black flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md ${buttonStyle}`}
                >
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Hint Card */}
          {showHint && !currentState.isCorrect && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-left flex items-start gap-3 animate-in fade-in">
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase">Helpful Tip</p>
                <p className="text-sm text-amber-800 font-medium">{currentQ.hint}</p>
              </div>
            </div>
          )}

          {/* Feedback & Action Bar */}
          {currentState.selectedOption !== null && (
            <div className="pt-2 animate-in fade-in">
              {currentState.isCorrect ? (
                /* Strict CORRECT state: only shows when answer is actually right */
                <div className="space-y-4">
                  <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-emerald-800 bg-emerald-50 px-5 py-2.5 rounded-2xl font-black text-base border-2 border-emerald-300 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span>{feedbackMessage || '✓ Correct! Great job!'}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-emerald-300 text-xs text-amber-700 font-black">
                      <span className="flex items-center gap-0.5 bg-amber-100 px-2 py-0.5 rounded-md">
                        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +10 XP
                      </span>
                      <span className="flex items-center gap-0.5 bg-yellow-100 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> +1 ⭐
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-base cursor-pointer"
                    >
                      {currentIndex < questions.length - 1 ? 'Next Question →' : 'Complete Activity! 🎉'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Strict INCORRECT state: NO XP, NO Stars, NO proceeding, allows retry */
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-rose-700 bg-rose-50 px-4 py-2 rounded-2xl font-bold text-sm border border-rose-300">
                    <span>{feedbackMessage || 'Not quite! Try again.'}</span>
                  </div>
                  <div>
                    <button
                      onClick={handleTryAgain}
                      className="px-6 py-2.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm inline-flex items-center gap-2 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rewards Celebration Modal */}
      <RewardModal
        isOpen={showRewardModal}
        gameTitle="Letter Match"
        earnedXP={10}
        earnedStars={2}
        totalXP={gamification.xp}
        unlockedBadgeId={completionResult?.newlyUnlockedBadgeId}
        skillGrowth={completionResult?.skillGrowth}
        onPlayAgain={handleRestartGame}
        onContinue={() => setScreen('learning-dashboard')}
      />
    </div>
  );
};
