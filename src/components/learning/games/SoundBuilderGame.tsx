import React, { useState } from 'react';
import { ArrowLeft, Volume2, HelpCircle, Check, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { RewardModal } from '../../gamification';

export const SoundBuilderGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.soundBuilder;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Rewards modal state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<GameCompletionResult | null>(null);

  const currentQ = questions[currentIndex] || questions[0];

  const handlePlayPromptAudio = () => {
    soundEngine.playPop();
    speakText(currentQ.audioSound, currentLanguage);
  };

  const handleOptionAudio = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    soundEngine.playPop();
    speakText(word, currentLanguage);
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
      const result = completeGame('sound-builder', 15, 3);
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-purple-50/40 to-teal-50/50 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-indigo-200 shadow-sm">
          <button
            onClick={() => setScreen('learning-dashboard')}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Adventure Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🔊</span>
            <span className="font-black text-slate-800 text-base sm:text-lg">Sound Builder</span>
          </div>

          <div className="text-xs font-black text-indigo-900 bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-300">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-indigo-100 rounded-full overflow-hidden border border-indigo-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Main Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-indigo-200 shadow-xl space-y-7 text-center">
          {/* Sound Prompt & Audio Button */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs uppercase tracking-wider">
              <span>Phonemic Sound Matching</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              {currentQ.soundPrompt}
            </h2>

            <div className="pt-2">
              <button
                onClick={handlePlayPromptAudio}
                className="px-6 py-3.5 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-base shadow-md shadow-indigo-600/25 active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer"
              >
                <Volume2 className="w-6 h-6 animate-pulse" />
                <span>Hear the Sound Again</span>
              </button>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isTargetCorrect = idx === currentQ.correctIndex;

              let cardStyle = 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800';
              if (isAnswered) {
                if (isTargetCorrect) {
                  cardStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200 scale-105';
                } else if (isSelected && !isTargetCorrect) {
                  cardStyle = 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-200 opacity-80';
                } else {
                  cardStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-between gap-2 transition-all cursor-pointer active:scale-95 shadow-md ${cardStyle}`}
                >
                  <span className="text-4xl sm:text-5xl font-black select-none">
                    {opt.letter}
                  </span>
                  <div className="text-xs font-bold opacity-80">{opt.sound}</div>

                  {/* Example word chip with speaker */}
                  <button
                    onClick={(e) => handleOptionAudio(e, opt.exampleWord)}
                    className="w-full py-1 px-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-[11px] font-semibold border border-slate-200 flex items-center justify-center gap-1 shadow-xs"
                    title={`Hear ${opt.exampleWord}`}
                  >
                    <Volume2 className="w-3 h-3 text-indigo-600" />
                    <span className="truncate">{opt.exampleWord}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 text-left flex items-start gap-3 animate-in fade-in">
              <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-indigo-900 uppercase">Sound Tip</p>
                <p className="text-sm text-indigo-800 font-medium">{currentQ.clue}</p>
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
                    <span>Exact match! Super phonemic listening skills!</span>
                  </div>
                  <div>
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-base"
                    >
                      {currentIndex < questions.length - 1 ? 'Next Sound →' : 'Complete Activity! 🎉'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-rose-600">
                    Listen closely to the starting sound and try again!
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
        gameTitle="Sound Builder"
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
