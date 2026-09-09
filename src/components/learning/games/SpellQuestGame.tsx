import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Check, RotateCcw, Delete, Star, Zap } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { validateTextAnswer } from '../../../services/answerValidationService';
import { RewardModal } from '../../gamification';

interface QuestionState {
  attempts: number;
  isAnswered: boolean;
  isCorrect: boolean;
  xpAwarded: boolean;
  userAnswer: string;
}

export const SpellQuestGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, addXP, addStars, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.spellQuest;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [typedInput, setTypedInput] = useState('');
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
    userAnswer: '',
  };

  // Auto-play audio on question change
  useEffect(() => {
    speakText(currentQ.audioPrompt, currentLanguage);
  }, [currentIndex, currentQ.audioPrompt, currentLanguage]);

  const handlePlayAudio = () => {
    soundEngine.playPop();
    speakText(currentQ.audioPrompt, currentLanguage);
  };

  const handleAddLetter = (letter: string) => {
    if (currentState.isCorrect) return;
    soundEngine.playPop();
    setTypedInput((prev) => prev + letter);
    setFeedbackMessage(null);
  };

  const handleDeleteLetter = () => {
    if (currentState.isCorrect) return;
    soundEngine.playPop();
    setTypedInput((prev) => prev.slice(0, -1));
    setFeedbackMessage(null);
  };

  const handleCheckAnswer = () => {
    if (!typedInput.trim() || currentState.isCorrect) return;

    // Use centralized Unicode-safe text validation
    const validation = validateTextAnswer(typedInput, currentQ.word, currentLanguage);

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
          userAnswer: typedInput,
        },
      }));
      setFeedbackMessage(validation.feedback);
    } else {
      soundEngine.playIncorrect();
      setQuestionStates((prev) => ({
        ...prev,
        [currentIndex]: {
          attempts: (prev[currentIndex]?.attempts || 0) + 1,
          isAnswered: false, // NOT completed
          isCorrect: false,
          xpAwarded: prev[currentIndex]?.xpAwarded || false,
          userAnswer: typedInput,
        },
      }));
      setFeedbackMessage(validation.feedback);
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTypedInput('');
      setFeedbackMessage(null);
    } else {
      const result = completeGame('spell-quest', 15, 2);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleTryAgain = () => {
    soundEngine.playPop();
    setTypedInput('');
    setFeedbackMessage(null);
    setQuestionStates((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        isCorrect: false,
        isAnswered: false,
        userAnswer: '',
      },
    }));
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setQuestionStates({});
    setTypedInput('');
    setFeedbackMessage(null);
    setShowRewardModal(false);
    setCompletionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-pink-50/40 to-amber-50/50 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-rose-200 shadow-sm">
          <button
            onClick={() => setScreen('learning-dashboard')}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Adventure Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">✍️</span>
            <span className="font-black text-slate-800 text-base sm:text-lg">Spell Quest</span>
          </div>

          <div className="text-xs font-black text-rose-900 bg-rose-100 px-3 py-1.5 rounded-full border border-rose-300">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden border border-rose-200">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Main Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-rose-200 shadow-xl space-y-7 text-center">
          {/* Visual Clue & Pronunciation */}
          <div className="space-y-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-5xl sm:text-6xl shadow-lg border-4 border-white ring-8 ring-rose-100">
              {currentQ.meaningEmoji}
            </div>

            <div className="flex items-center justify-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-700 max-w-md">
                {currentQ.clue}
              </h3>
              <button
                onClick={handlePlayAudio}
                className="p-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 shadow-sm active:scale-95 transition-all cursor-pointer"
                title="Hear word sound again"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Spell Word Input Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <div
                className={`min-w-[200px] sm:min-w-[280px] max-w-md px-6 py-4 rounded-2xl border-3 text-3xl sm:text-4xl font-black tracking-widest transition-all ${
                  currentState.attempts > 0
                    ? currentState.isCorrect
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200 shadow-emerald-200'
                      : 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-200'
                    : 'bg-slate-50 border-rose-300 text-slate-900 shadow-inner'
                }`}
              >
                {typedInput ? (
                  <span>{typedInput}</span>
                ) : (
                  <span className="text-slate-300 font-normal text-2xl tracking-normal">
                    Tap letters below...
                  </span>
                )}
              </div>
            </div>

            {/* Target length indicator */}
            <p className="text-xs font-semibold text-slate-400">
              Word has {currentQ.word.length} characters
            </p>
          </div>

          {/* Onscreen Letter Pad / Bank */}
          {!currentState.isCorrect && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-md mx-auto">
                {currentQ.letterBank.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddLetter(letter)}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 border-rose-200 bg-gradient-to-b from-white to-rose-50 hover:bg-rose-100 text-rose-950 font-black text-2xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                  >
                    {letter}
                  </button>
                ))}
                <button
                  onClick={handleDeleteLetter}
                  className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Backspace"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleCheckAnswer}
                  disabled={!typedInput.trim()}
                  className="px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all text-base disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Check Spelling ✓
                </button>
              </div>
            </div>
          )}

          {/* Feedback & Actions */}
          {feedbackMessage && (
            <div className="pt-2 animate-in fade-in">
              {currentState.isCorrect ? (
                /* Strict CORRECT state: only shows when word matches expected */
                <div className="space-y-4">
                  <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-emerald-800 bg-emerald-50 px-5 py-2.5 rounded-2xl font-black text-base border-2 border-emerald-300 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span>{feedbackMessage}</span>
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
                      {currentIndex < questions.length - 1 ? 'Next Word →' : 'Complete Quest! 🎉'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Strict INCORRECT state: NO XP, NO Stars, allows retry */
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-rose-700 bg-rose-50 px-4 py-2 rounded-2xl font-bold text-sm border border-rose-300">
                    <span>{feedbackMessage}</span>
                  </div>
                  <div>
                    <button
                      onClick={handleTryAgain}
                      className="px-6 py-2.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm inline-flex items-center gap-2 cursor-pointer"
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
        gameTitle="Spell Quest"
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
