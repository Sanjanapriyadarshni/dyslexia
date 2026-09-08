import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useScreening } from '../../context/ScreeningContext';
import { getScreeningContent } from '../../screeningContent';
import { analyzeReadingSpeech } from '../../services/speechAnalysisService';
import { speakText, soundEngine } from '../../hooks/useSound';
import { Button } from '../common/Button';
import { AudioSpeaker } from '../common/AudioSpeaker';
import type { SpeechAnalysisResult } from '../../types';

export const ReadingTestScreen: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const { setScreen } = useProfile();
  const { setReadingResult } = useScreening();

  const content = getScreeningContent(currentLanguage);
  const task = content.readingTask;

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setLocalAnalysisResult] = useState<SpeechAnalysisResult | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePlaySentence = () => {
    speakText(task.audioPronunciation, currentLanguage);
  };

  const handleStartRecording = () => {
    soundEngine.playPop();
    setIsRecording(true);
    setRecordSeconds(0);
    setLocalAnalysisResult(null);

    timerRef.current = setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
  };

  const handleStopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setIsAnalyzing(true);
    soundEngine.playClick();

    // Call decoupled speech analysis AI service
    const duration = Math.max(3, recordSeconds);
    const result = await analyzeReadingSpeech(task.sentence, currentLanguage, duration);

    setIsAnalyzing(false);
    setLocalAnalysisResult(result);
    setReadingResult(result);
    soundEngine.playSuccess();
  };

  const handleSkip = async () => {
    // Generate standard indicative benchmark result if child skips voice recording
    const result = await analyzeReadingSpeech(task.sentence, currentLanguage, 4);
    setReadingResult(result);
    setScreen('screening-spelling');
  };

  const handleContinue = () => {
    setScreen('screening-spelling');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-3xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('screening-letter')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nav.back')}</span>
          </button>
          <span className="text-xs font-extrabold text-teal-900 bg-teal-100 px-3.5 py-1 rounded-full border border-teal-300">
            {t('screening.reading.step')}
          </span>
        </div>

        {/* Instruction */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            {t('screening.reading.step')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {t('screening.reading.instruction')}
          </p>
        </div>

        {/* Reading Sentence Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm text-center mb-6 relative">
          <div className="flex items-center justify-end mb-2">
            <AudioSpeaker
              size="sm"
              label={t('screening.reading.listenSentence')}
              onPlay={handlePlaySentence}
            />
          </div>

          {/* Large readable text */}
          <div className="py-6 px-4 rounded-2xl bg-teal-50/50 border-2 border-teal-200/60 my-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-teal-950 leading-relaxed tracking-wide select-none">
              "{task.sentence}"
            </p>
          </div>

          {/* Interactive Microphone Section */}
          <div className="mt-8 flex flex-col items-center">
            {isRecording ? (
              <div className="flex flex-col items-center gap-3">
                {/* Pulsing Mic Wave Animation */}
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-rose-400/30 animate-ping" />
                  <div className="absolute -inset-2 rounded-full bg-rose-500/20 animate-pulse" />
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="relative w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 cursor-pointer transform scale-105 transition-transform"
                  >
                    <MicOff className="w-8 h-8" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-rose-700 font-black text-sm animate-pulse">
                  <Activity className="w-4 h-4" />
                  <span>{t('screening.reading.recordingState')} ({recordSeconds}s)</span>
                </div>

                <Button
                  variant="coral"
                  size="md"
                  soundType="click"
                  onClick={handleStopRecording}
                >
                  {t('screening.reading.stopRecord')}
                </Button>
              </div>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
                <p className="text-sm font-bold text-teal-800">
                  {t('screening.reading.analyzing')}
                </p>
              </div>
            ) : analysisResult ? (
              <div className="w-full text-left bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{t('screening.reading.analysisDone')}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-200/70 px-3 py-1 rounded-full">
                    AI Speech Model
                  </span>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200">
                    <div className="text-xs font-bold text-slate-500">
                      {t('screening.reading.accuracyLabel')}
                    </div>
                    <div className="text-2xl font-black text-emerald-800">
                      {analysisResult.accuracy}%
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-emerald-200">
                    <div className="text-xs font-bold text-slate-500">
                      {t('screening.reading.wordsCorrectLabel')}
                    </div>
                    <div className="text-2xl font-black text-emerald-800">
                      {analysisResult.wordsReadCorrectly} / {analysisResult.totalWords}
                    </div>
                  </div>
                </div>

                {/* Word by word breakdown */}
                <div>
                  <div className="text-xs font-bold text-slate-600 mb-1.5">
                    Word Alignment:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.wordsBreakdown.map((item, i) => (
                      <span
                        key={i}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                          item.status === 'correct'
                            ? 'bg-white text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.word} {item.status === 'hesitation' ? '⏱️' : '✓'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pattern observation */}
                <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 text-xs text-slate-700 font-semibold leading-relaxed">
                  <span className="font-extrabold text-emerald-900">
                    {t('screening.reading.patternObservation')}:
                  </span>{' '}
                  {analysisResult.possiblePattern}
                </div>

                {/* Try again option */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Record Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-20 h-20 rounded-full bg-teal-600 hover:bg-teal-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-teal-700/30 cursor-pointer transition-all"
                >
                  <Mic className="w-9 h-9" />
                </button>
                <span className="text-xs font-extrabold text-slate-500">
                  {t('screening.reading.startRecord')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
        >
          {t('screening.reading.skip')}
        </button>

        <Button
          variant="primary"
          size="lg"
          disabled={!analysisResult}
          onClick={handleContinue}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="min-w-[220px]"
        >
          {t('screening.reading.continueBtn')}
        </Button>
      </div>
    </div>
  );
};
