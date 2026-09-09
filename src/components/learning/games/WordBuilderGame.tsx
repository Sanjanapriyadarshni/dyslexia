import React, { useState } from 'react';
import { ArrowLeft, Volume2, RotateCcw, Check, Star, Zap } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { validateWordBuilderAnswer } from '../../../services/answerValidationService';
import { RewardModal } from '../../gamification';

interface QuestionState {
  attempts: number;
  isAnswered: boolean;
  isCorrect: boolean;
  xpAwarded: boolean;
}

export const WordBuilderGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, addXP, addStars, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.wordBuilder;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
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
  };

  const handleTileClick = (index: number) => {
    if (placedIndices.includes(index) || currentState.isCorrect) return;
    soundEngine.playPop();

    const newPlaced = [...placedIndices, index];
    setPlacedIndices(newPlaced);
    setFeedbackMessage(null);

    // If all tiles placed, validate immediately
    if (newPlaced.length === currentQ.scrambledLetters.length) {
      const placedLetters = newPlaced.map((i) => currentQ.scrambledLetters[i]);
      const validation = validateWordBuilderAnswer(placedLetters, currentQ.word, currentLanguage);

      if (validation.isCorrect) {
        soundEngine.playSuccess();
        speakText(currentQ.word, currentLanguage);

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
          },
        }));
        setFeedbackMessage(validation.feedback);
      } else {
        // Wrong arrangement
        soundEngine.playIncorrect();

        setQuestionStates((prev) => ({
          ...prev,
          [currentIndex]: {
            attempts: (prev[currentIndex]?.attempts || 0) + 1,
            isAnswered: false, // NOT completed
            isCorrect: false,
            xpAwarded: prev[currentIndex]?.xpAwarded || false,
          },
        }));
        setFeedbackMessage(validation.feedback);
      }
    }
  };

  const handleRemoveLast = () => {
    if (placedIndices.length === 0 || currentState.isCorrect) return;
    soundEngine.playPop();
    setPlacedIndices((prev) => prev.slice(0, -1));
    setFeedbackMessage(null);
  };

  const handleClear = () => {
    if (currentState.isCorrect) return;
    soundEngine.playPop();
    setPlacedIndices([]);
    setFeedbackMessage(null);
  };

  const handlePlayAudio = () => {
    soundEngine.playPop();
    speakText(currentQ.audioPronunciation, currentLanguage);
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPlacedIndices([]);
      setFeedbackMessage(null);
    } else {
      const result = completeGame('word-builder', 15, 2);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setQuestionStates({});
    setPlacedIndices([]);
    setFeedbackMessage(null);
    setShowRewardModal(false);
    setCompletionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 via-emerald-50/40 to-cyan-50/50 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-teal-200 shadow-sm">
          <button
            onClick={() => setScreen('learning-dashboard')}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Adventure Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <span className="font-black text-slate-800 text-base sm:text-lg">Word Builder</span>
          </div>

          <div className="text-xs font-black text-teal-900 bg-teal-100 px-3 py-1.5 rounded-full border border-teal-300">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-teal-100 rounded-full overflow-hidden border border-teal-200">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Main Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-teal-200 shadow-xl space-y-7 text-center">
          {/* Picture Clue & Audio */}
          <div className="space-y-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-5xl sm:text-6xl shadow-lg border-4 border-white ring-8 ring-teal-100">
              {currentQ.meaningEmoji}
            </div>

            <div className="flex items-center justify-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-700 max-w-md">
                {currentQ.clue}
              </h3>
              <button
                onClick={handlePlayAudio}
                className="p-2.5 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-800 border border-teal-300 shadow-sm active:scale-95 transition-all cursor-pointer"
                title="Listen to word"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Word Slots (Answer Zone) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tap letters below to arrange:
            </span>
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap min-h-[70px]">
              {Array.from({ length: currentQ.scrambledLetters.length }).map((_, slotIdx) => {
                const letter = placedIndices[slotIdx] !== undefined ? currentQ.scrambledLetters[placedIndices[slotIdx]] : '';

                const isAllPlaced = placedIndices.length === currentQ.scrambledLetters.length;

                return (
                  <div
                    key={slotIdx}
                    className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${
                      letter
                        ? isAllPlaced
                          ? currentState.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-105 shadow-md shadow-emerald-200 ring-2 ring-emerald-200'
                            : 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-200'
                          : 'bg-teal-50 border-teal-400 text-teal-950 shadow-sm'
                        : 'border-dashed border-slate-300 bg-slate-50'
                    }`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scrambled Available Letters Bank */}
          {!currentState.isCorrect && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {currentQ.scrambledLetters.map((letter, idx) => {
                  const isPlaced = placedIndices.includes(idx);

                  return (
                    <button
                      key={idx}
                      disabled={isPlaced || currentState.isCorrect}
                      onClick={() => handleTileClick(idx)}
                      className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 text-2xl sm:text-3xl font-black flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        isPlaced
                          ? 'opacity-20 border-slate-200 bg-slate-100 cursor-not-allowed scale-95'
                          : 'border-teal-400 bg-gradient-to-b from-white to-teal-50 text-teal-950 hover:bg-teal-100 hover:scale-105 active:scale-95 ring-2 ring-teal-100'
                      }`}
                    >
                      <span>{letter}</span>
                    </button>
                  );
                })}
              </div>

              {/* Backspace & Clear Buttons */}
              {placedIndices.length > 0 && !currentState.isCorrect && (
                <div className="flex justify-center gap-3 pt-1">
                  <button
                    onClick={handleRemoveLast}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300 active:scale-95 cursor-pointer"
                  >
                    Undo Letter
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300 active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Feedback & Progression */}
          {feedbackMessage && (
            <div className="pt-2 animate-in fade-in">
              {currentState.isCorrect ? (
                /* Strict CORRECT state: only shows when letters spell target word */
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
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all text-base cursor-pointer"
                    >
                      {currentIndex < questions.length - 1 ? 'Next Word →' : 'Finish Adventure! 🎉'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Strict INCORRECT state: NO XP, NO Stars, allows clearing tiles */
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-rose-700 bg-rose-50 px-4 py-2 rounded-2xl font-bold text-sm border border-rose-300">
                    <span>{feedbackMessage}</span>
                  </div>
                  <div>
                    <button
                      onClick={handleClear}
                      className="px-6 py-2.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm inline-flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Tiles & Try Again
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
        gameTitle="Word Builder"
        earnedXP={15}
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
