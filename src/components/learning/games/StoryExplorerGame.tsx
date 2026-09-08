import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  BookOpen,
  Check,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { RewardModal } from '../../gamification';

export const StoryExplorerGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const stories = content.storyExplorer;

  const currentStory = stories[0]; // Active story
  const questions = currentStory.questions;

  const [step, setStep] = useState<'reading' | 'quiz'>('reading');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Rewards modal state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<GameCompletionResult | null>(null);

  const currentQ = questions[currentQIndex] || questions[0];

  const handlePlayStoryAudio = () => {
    soundEngine.playPop();
    const fullText = currentStory.paragraphs.join(' ');
    speakText(fullText, currentLanguage);
  };

  const handleParagraphAudio = (para: string) => {
    soundEngine.playPop();
    speakText(para, currentLanguage);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      const result = completeGame('story-explorer', 25, 4);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleRestart = () => {
    setStep('reading');
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowRewardModal(false);
    setCompletionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-pink-50/40 to-indigo-50/50 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-purple-200 shadow-sm">
          <button
            onClick={() => setScreen('learning-dashboard')}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Adventure Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="font-black text-slate-800 text-base sm:text-lg">Story Explorer</span>
          </div>

          <div className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1.5 rounded-full border border-purple-300">
            {step === 'reading' ? 'Story Time' : `Quiz ${currentQIndex + 1}/${questions.length}`}
          </div>
        </div>

        {/* Story Reading Phase */}
        {step === 'reading' && (
          <div className="bg-white rounded-3xl p-6 sm:p-9 border-3 border-purple-200 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-purple-100">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-500 text-white flex items-center justify-center text-4xl shadow-md">
                  {currentStory.emoji}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentStory.title}
                  </h2>
                  <p className="text-xs font-semibold text-purple-700">
                    Read along with the friendly story
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlayStoryAudio}
                className="px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs border border-purple-300 shadow-sm flex items-center gap-2 active:scale-95 transition-all cursor-pointer flex-shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen to Full Story</span>
              </button>
            </div>

            {/* Paragraphs with individual audio read-aloud buttons */}
            <div className="space-y-4">
              {currentStory.paragraphs.map((para, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 hover:bg-purple-50 transition-colors flex items-start gap-3.5 group"
                >
                  <button
                    onClick={() => handleParagraphAudio(para)}
                    className="p-2 rounded-xl bg-white text-purple-700 border border-purple-200 shadow-xs hover:bg-purple-600 hover:text-white transition-colors flex-shrink-0 mt-0.5 cursor-pointer"
                    title="Read this line"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                    {para}
                  </p>
                </div>
              ))}
            </div>

            {/* Proceed to Quiz Button */}
            <div className="pt-4 text-center">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setStep('quiz');
                }}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-600/25 active:scale-95 transition-all text-base inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                <span>I'm Ready for Story Questions! 🚀</span>
              </button>
            </div>
          </div>
        )}

        {/* Quiz Phase */}
        {step === 'quiz' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-xl space-y-6">
            {/* Question Header */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Choices */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isTargetCorrect = idx === currentQ.correctIndex;

                let optStyle = 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-800';
                if (isAnswered) {
                  if (isTargetCorrect) {
                    optStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200';
                  } else if (isSelected && !isTargetCorrect) {
                    optStyle = 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-200';
                  } else {
                    optStyle = 'bg-slate-50 border-slate-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered && isCorrect}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left font-bold text-base sm:text-lg flex items-center justify-between transition-all cursor-pointer active:scale-98 shadow-sm ${optStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isTargetCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Explanation Card */}
            {isAnswered && (
              <div className="pt-2 animate-in fade-in space-y-4">
                <div
                  className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-sm">
                      {isCorrect ? 'Awesome Recall!' : 'Story Clue:'}
                    </p>
                    <p className="text-xs sm:text-sm font-medium">{currentQ.explanation}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {!isCorrect && (
                    <button
                      onClick={() => {
                        soundEngine.playPop();
                        setSelectedOption(null);
                        setIsAnswered(false);
                      }}
                      className="px-6 py-2.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                  )}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-600/25 active:scale-95 transition-all text-base"
                  >
                    {currentQIndex < questions.length - 1 ? 'Next Question →' : 'Complete Story! 🎉'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rewards Celebration Modal */}
      <RewardModal
        isOpen={showRewardModal}
        gameTitle="Story Explorer"
        earnedXP={25}
        earnedStars={4}
        totalXP={gamification.xp}
        unlockedBadgeId={completionResult?.newlyUnlockedBadgeId}
        skillGrowth={completionResult?.skillGrowth}
        onPlayAgain={handleRestart}
        onContinue={() => setScreen('learning-dashboard')}
      />
    </div>
  );
};
