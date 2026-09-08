import React, { useState } from 'react';
import { ArrowLeft, Volume2, HelpCircle, Check, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { RewardModal } from '../../gamification';

export const LetterMatchGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.letterMatch;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Rewards modal state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<GameCompletionResult | null>(null);

  const currentQ = questions[currentIndex] || questions[0];

  const handlePlayAudio = () => {
    soundEngine.playPop();
    speakText(currentQ.audioPronunciation, currentLanguage);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playIncorrect();
      setShowHint(true);
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Completed game
      const result = completeGame('letter-match', 15, 3);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleTryAgainRound = () => {
    soundEngine.playPop();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setIsAnswered(false);
    setIsCorrect(false);
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
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95"
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
              const isSelected = selectedOption === idx;
              const isTargetCorrect = idx === currentQ.correctIndex;

              let buttonStyle = 'bg-slate-50 border-slate-300 hover:bg-amber-50 hover:border-amber-400 text-slate-800';
              if (isAnswered) {
                if (isTargetCorrect) {
                  buttonStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200 scale-105';
                } else if (isSelected && !isTargetCorrect) {
                  buttonStyle = 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-200 opacity-80';
                } else {
                  buttonStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered && isCorrect}
                  className={`h-24 sm:h-28 rounded-3xl border-3 text-4xl sm:text-5xl font-black flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md ${buttonStyle}`}
                >
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-left flex items-start gap-3 animate-in fade-in">
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase">Helpful Tip</p>
                <p className="text-sm text-amber-800 font-medium">{currentQ.hint}</p>
              </div>
            </div>
          )}

          {/* Feedback & Action Bar */}
          {isAnswered && (
            <div className="pt-2 animate-in fade-in">
              {isCorrect ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl font-black text-base border border-emerald-200">
                    <Check className="w-5 h-5" />
                    <span>Spot on! Excellent visual recognition!</span>
                  </div>
                  <div>
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-base"
                    >
                      {currentIndex < questions.length - 1 ? 'Next Question →' : 'Complete Activity! 🎉'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-rose-600">
                    Almost there! Notice the direction and shape, then try again!
                  </p>
                  <button
                    onClick={handleTryAgainRound}
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
        gameTitle="Letter Match"
        earnedXP={15}
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
