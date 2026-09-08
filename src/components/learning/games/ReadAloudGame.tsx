import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Mic,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { RewardModal } from '../../gamification';

export const ReadAloudGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.readAloud;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQ = questions[currentIndex] || questions[0];

  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState(92);
  const [highlightedWordIdx, setHighlightedWordIdx] = useState<number | null>(null);

  // Rewards modal state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<GameCompletionResult | null>(null);

  const handlePlaySentenceAudio = () => {
    soundEngine.playPop();
    speakText(currentQ.audioPronunciation, currentLanguage);
  };

  const handleWordTap = (word: string, index: number) => {
    soundEngine.playPop();
    setHighlightedWordIdx(index);
    speakText(word, currentLanguage);
  };

  const handleStartRecording = () => {
    soundEngine.playClick();
    setIsRecording(true);
    setIsAnalyzed(false);

    // Simulate 3.5 seconds child reading recording
    setTimeout(() => {
      setIsRecording(false);
      setIsAnalyzed(true);
      const score = Math.floor(Math.random() * 8) + 91; // 91% to 98%
      setAccuracyScore(score);
      soundEngine.playSuccess();
    }, 3500);
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnalyzed(false);
      setIsRecording(false);
      setHighlightedWordIdx(null);
    } else {
      const result = completeGame('read-aloud', 25, 4);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleTryAgain = () => {
    soundEngine.playPop();
    setIsAnalyzed(false);
    setIsRecording(false);
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setIsAnalyzed(false);
    setIsRecording(false);
    setHighlightedWordIdx(null);
    setShowRewardModal(false);
    setCompletionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-blue-50/40 to-indigo-50/50 pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-sky-200 shadow-sm">
          <button
            onClick={() => setScreen('learning-dashboard')}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Adventure Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            <span className="font-black text-slate-800 text-base sm:text-lg">Read Aloud</span>
          </div>

          <div className="text-xs font-black text-sky-900 bg-sky-100 px-3 py-1.5 rounded-full border border-sky-300">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden border border-sky-200">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Main Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-sky-200 shadow-xl space-y-7 text-center">
          {/* Header & Prompt */}
          <div className="space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-4xl shadow-md border-2 border-white ring-4 ring-sky-100">
              {currentQ.meaningEmoji}
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider bg-sky-100 px-3 py-1 rounded-full">
                Tap words to hear pronunciation, then read aloud!
              </span>
              <button
                onClick={handlePlaySentenceAudio}
                className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 shadow-sm active:scale-95 transition-all"
                title="Hear full sentence"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Sentence Word Tokens */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-sky-200/80 shadow-inner">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-2xl sm:text-3xl font-black text-slate-800 leading-relaxed">
              {currentQ.phonemeTokens.map((token, idx) => {
                const isSelected = highlightedWordIdx === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleWordTap(token.word, idx)}
                    className={`px-3 py-1.5 rounded-2xl transition-all border-2 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-105'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-sky-50 shadow-sm'
                    }`}
                  >
                    <span>{token.word}</span>
                    <span className="block text-[10px] sm:text-xs font-semibold opacity-70 tracking-normal">
                      {token.phonetic}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recording / Listening Zone */}
          {!isAnalyzed && (
            <div className="space-y-4 pt-2">
              {isRecording ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 ring-8 ring-rose-200 animate-pulse">
                    <Mic className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Listening carefully to your reading...</span>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleStartRecording}
                    className="px-8 py-4 rounded-3xl font-black text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-lg shadow-sky-600/30 active:scale-95 transition-all text-lg inline-flex items-center gap-3 cursor-pointer"
                  >
                    <Mic className="w-6 h-6" />
                    <span>Tap to Read Aloud</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analysis & Feedback Results */}
          {isAnalyzed && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-black text-emerald-900 text-base sm:text-lg">
                      Clear & Expressive Reading!
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black text-sm">
                    {accuracyScore}% Accuracy
                  </span>
                </div>

                <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                  {currentQ.encouragement}
                </p>

                {/* Syllable precision breakdown */}
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Great rhythm and smooth letter blending throughout the sentence.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleTryAgain}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Read Again
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-base"
                >
                  {currentIndex < questions.length - 1 ? 'Next Sentence →' : 'Complete Activity! 🎉'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Celebration Modal */}
      <RewardModal
        isOpen={showRewardModal}
        gameTitle="Read Aloud"
        earnedXP={25}
        earnedStars={4}
        totalXP={gamification.xp}
        unlockedBadgeId={completionResult?.newlyUnlockedBadgeId}
        skillGrowth={completionResult?.skillGrowth}
        onPlayAgain={handleRestartGame}
        onContinue={() => setScreen('learning-dashboard')}
      />
    </div>
  );
};
