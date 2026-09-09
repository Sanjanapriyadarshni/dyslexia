import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Mic,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProfile, type GameCompletionResult } from '../../../context/ProfileContext';
import { getGameContent } from '../../../content/games';
import { speakText, soundEngine } from '../../../hooks/useSound';
import { validateSpeechReading, type ValidationResult } from '../../../services/answerValidationService';
import { RewardModal } from '../../gamification';

interface QuestionState {
  attempts: number;
  isAnswered: boolean;
  isCorrect: boolean;
  xpAwarded: boolean;
  accuracy: number;
}

export const ReadAloudGame: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { completeGame, addXP, addStars, gamification, setScreen } = useProfile();

  const content = getGameContent(currentLanguage);
  const questions = content.readAloud;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [highlightedWordIdx, setHighlightedWordIdx] = useState<number | null>(null);

  // Simulation mode toggle for hackathon judges & testers: Accurate vs Mismatched
  const [simulationMode, setSimulationMode] = useState<'accurate' | 'mismatched'>('accurate');

  // Rewards modal state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<GameCompletionResult | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const currentState: QuestionState = questionStates[currentIndex] || {
    attempts: 0,
    isAnswered: false,
    isCorrect: false,
    xpAwarded: false,
    accuracy: 0,
  };

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
    setValidationResult(null);

    // Simulate 2.5s child voice input
    setTimeout(() => {
      setIsRecording(false);

      let mockTranscript = currentQ.sentence;

      // If tester/child selected mismatched simulation or first attempt has errors
      if (simulationMode === 'mismatched') {
        if (currentLanguage === 'ta') {
          // Replace last word with completely different word
          mockTranscript = currentQ.sentence.replace('விளையாடுகிறது', 'ஓடுகிறது').replace('தருகிறது', 'பார்க்கிறது');
        } else {
          // Replace key words with phonetic errors (e.g. ball -> bell, garden -> golden)
          mockTranscript = currentQ.sentence
            .replace('ball', 'bell')
            .replace('garden', 'golden')
            .replace('bedtime', 'bad time');
        }
      }

      // Validate mock transcript against expected sentence
      const validation = validateSpeechReading(mockTranscript, currentQ.sentence, currentLanguage);
      setValidationResult(validation);

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
            accuracy: validation.accuracyPercentage || 95,
          },
        }));
      } else {
        // Did not meet accuracy threshold (< 75%)
        soundEngine.playIncorrect();

        setQuestionStates((prev) => ({
          ...prev,
          [currentIndex]: {
            attempts: (prev[currentIndex]?.attempts || 0) + 1,
            isAnswered: false, // NOT completed
            isCorrect: false,
            xpAwarded: prev[currentIndex]?.xpAwarded || false,
            accuracy: validation.accuracyPercentage || 50,
          },
        }));
      }
    }, 2500);
  };

  const handleTryAgain = () => {
    soundEngine.playPop();
    setValidationResult(null);
    setIsRecording(false);
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setValidationResult(null);
      setIsRecording(false);
      setHighlightedWordIdx(null);
    } else {
      const result = completeGame('read-aloud', 15, 2);
      setCompletionResult(result);
      setShowRewardModal(true);
    }
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setQuestionStates({});
    setValidationResult(null);
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
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 text-sm font-bold active:scale-95 cursor-pointer"
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
                className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 shadow-sm active:scale-95 transition-all cursor-pointer"
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

          {/* Demo Simulation Mode Selector (Tester Tool) */}
          {!validationResult && (
            <div className="inline-flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <span className="text-slate-500 px-2">Voice Simulation:</span>
              <button
                onClick={() => setSimulationMode('accurate')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  simulationMode === 'accurate'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Clear Speech (Pass)
              </button>
              <button
                onClick={() => setSimulationMode('mismatched')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  simulationMode === 'mismatched'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Hesitation / Mismatch (Test Fail)
              </button>
            </div>
          )}

          {/* Recording / Listening Zone */}
          {!validationResult && (
            <div className="space-y-4 pt-2">
              {isRecording ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 ring-8 ring-rose-200 animate-pulse">
                    <Mic className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Listening to your reading... Speak clearly!</span>
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

          {/* Analysis & Validation Results */}
          {validationResult && (
            <div className="space-y-5 animate-in fade-in">
              {validationResult.isCorrect ? (
                /* Strict CORRECT state */
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-left space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <h4 className="font-black text-emerald-900 text-base sm:text-lg">
                        {validationResult.feedback}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black text-sm">
                      {validationResult.accuracyPercentage}% Accuracy
                    </span>
                  </div>

                  {/* Word-by-word match breakdown */}
                  {validationResult.wordMatches && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {validationResult.wordMatches.map((m, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                            m.isMatch
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}
                        >
                          {m.expected} {m.isMatch ? '✓' : '✗'}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2 text-xs font-black text-amber-800">
                    <span className="flex items-center gap-0.5 bg-amber-100 px-2.5 py-1 rounded-md">
                      <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +10 XP
                    </span>
                    <span className="flex items-center gap-0.5 bg-yellow-100 px-2.5 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> +1 ⭐
                    </span>
                  </div>
                </div>
              ) : (
                /* Strict INCORRECT state (< 75% accuracy) */
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-left space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-6 h-6 text-rose-600" />
                      <h4 className="font-black text-rose-900 text-base sm:text-lg">
                        {validationResult.feedback}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-900 font-black text-sm">
                      {validationResult.accuracyPercentage}% Accuracy (Below Target)
                    </span>
                  </div>

                  {/* Word breakdown showing errors */}
                  {validationResult.wordMatches && (
                    <div className="space-y-1 pt-1">
                      <span className="text-xs font-bold text-rose-800">Word recognition breakdown:</span>
                      <div className="flex flex-wrap gap-2">
                        {validationResult.wordMatches.map((m, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                              m.isMatch
                                ? 'bg-white text-slate-700 border-slate-200'
                                : 'bg-rose-200 text-rose-950 border-rose-400 font-black'
                            }`}
                          >
                            {m.expected} {m.isMatch ? '✓' : `(heard: "${m.word}")`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-rose-700 font-semibold pt-1">
                    No XP awarded. Tap individual words above to hear them, then try reading again!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleTryAgain}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  Read Again
                </button>

                {validationResult.isCorrect && (
                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-base cursor-pointer"
                  >
                    {currentIndex < questions.length - 1 ? 'Next Sentence →' : 'Complete Activity! 🎉'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Celebration Modal */}
      <RewardModal
        isOpen={showRewardModal}
        gameTitle="Read Aloud"
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
