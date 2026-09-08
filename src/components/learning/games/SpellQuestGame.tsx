import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Check, RotateCcw, Delete } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { RewardModal } from '../../gamification';

export const SpellQuestGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.spellQuest;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQ = questions[currentIndex] || questions[0];

  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Rewards modal state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<GameCompletionResult | null>(null);

  // Auto-play audio on question change
  useEffect(() => {
    speakText(currentQ.audioPrompt, currentLanguage);
  }, [currentIndex, currentQ.audioPrompt, currentLanguage]);

  const handlePlayAudio = () => {
    soundEngine.playPop();
    speakText(currentQ.audioPrompt, currentLanguage);
  };

  const handleAddLetter = (letter: string) => {
    if (isAnswered) return;
    soundEngine.playPop();
    setTypedInput((prev) => prev + letter);
  };

  const handleDeleteLetter = () => {
    if (isAnswered) return;
    soundEngine.playPop();
    setTypedInput((prev) => prev.slice(0, -1));
  };

  const handleCheckAnswer = () => {
    if (!typedInput.trim()) return;
    setIsAnswered(true);

    const match = typedInput.trim().toLowerCase() === currentQ.word.toLowerCase();
    setIsCorrect(match);

    if (match) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playIncorrect();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTypedInput('');
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      const result = completeGame('spell-quest', 20, 3);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleTryAgain = () => {
    soundEngine.playPop();
    setTypedInput('');
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setTypedInput('');
    setIsAnswered(false);
    setIsCorrect(false);
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
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95"
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
                className="p-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 shadow-sm active:scale-95 transition-all"
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
                  isAnswered
                    ? isCorrect
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200'
                      : 'bg-rose-100 border-rose-400 text-rose-950'
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
          {!isAnswered && (
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
          {isAnswered && (
            <div className="pt-2 animate-in fade-in">
              {isCorrect ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl font-black text-base border border-emerald-200">
                    <Check className="w-5 h-5" />
                    <span>Brilliant spelling! You mastered "{currentQ.word}"!</span>
                  </div>
                  <div>
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-base"
                    >
                      {currentIndex < questions.length - 1 ? 'Next Word →' : 'Complete Quest! 🎉'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-rose-600">
                    Great attempt! The letters sound very close. Try typing it once more!
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="px-6 py-2.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
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
        earnedXP={20}
        earnedStars={3}
        totalXP={gamification.xp}
        unlockedBadgeId={completionResult?.newlyUnlockedBadgeId}
        skillGrowth={completionResult?.skillGrowth}
        onPlayAgain={handleRestartGame}
        onContinue={() => setScreen('learning-dashboard')}
      />
    </div>
  );
};
