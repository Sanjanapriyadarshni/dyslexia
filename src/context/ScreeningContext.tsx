import React, { createContext, useContext, useState } from 'react';
import type {
  LanguageCode,
  ScreeningReport,
  SpeechAnalysisResult,
} from '../types';
import { calculateScreeningReport, getLatestScreeningReport } from '../services/screeningService';

interface LetterAnswerRecord {
  questionId: string;
  isCorrect: boolean;
  timeSeconds: number;
}

interface SpellingAnswerRecord {
  questionId: string;
  isCorrect: boolean;
  typedWord: string;
}

interface ComprehensionAnswerRecord {
  questionId: string;
  isCorrect: boolean;
}

interface ScreeningContextType {
  letterAnswers: LetterAnswerRecord[];
  recordLetterAnswer: (questionId: string, isCorrect: boolean, timeSeconds: number) => void;
  readingResult: SpeechAnalysisResult | null;
  setReadingResult: (result: SpeechAnalysisResult) => void;
  spellingAnswers: SpellingAnswerRecord[];
  recordSpellingAnswer: (questionId: string, isCorrect: boolean, typedWord: string) => void;
  comprehensionAnswers: ComprehensionAnswerRecord[];
  recordComprehensionAnswer: (questionId: string, isCorrect: boolean) => void;
  screeningReport: ScreeningReport | null;
  isAnalyzing: boolean;
  generateReport: (language: LanguageCode) => Promise<ScreeningReport>;
  resetScreeningSession: () => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export const ScreeningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [letterAnswers, setLetterAnswers] = useState<LetterAnswerRecord[]>([]);
  const [readingResult, setReadingResultState] = useState<SpeechAnalysisResult | null>(null);
  const [spellingAnswers, setSpellingAnswers] = useState<SpellingAnswerRecord[]>([]);
  const [comprehensionAnswers, setComprehensionAnswers] = useState<ComprehensionAnswerRecord[]>([]);
  const [screeningReport, setScreeningReport] = useState<ScreeningReport | null>(() => {
    return getLatestScreeningReport();
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recordLetterAnswer = (questionId: string, isCorrect: boolean, timeSeconds: number) => {
    setLetterAnswers((prev) => [...prev.filter((a) => a.questionId !== questionId), { questionId, isCorrect, timeSeconds }]);
  };

  const setReadingResult = (result: SpeechAnalysisResult) => {
    setReadingResultState(result);
  };

  const recordSpellingAnswer = (questionId: string, isCorrect: boolean, typedWord: string) => {
    setSpellingAnswers((prev) => [...prev.filter((a) => a.questionId !== questionId), { questionId, isCorrect, typedWord }]);
  };

  const recordComprehensionAnswer = (questionId: string, isCorrect: boolean) => {
    setComprehensionAnswers((prev) => [...prev.filter((a) => a.questionId !== questionId), { questionId, isCorrect }]);
  };

  const generateReport = async (language: LanguageCode): Promise<ScreeningReport> => {
    setIsAnalyzing(true);
    try {
      const report = await calculateScreeningReport({
        language,
        letterAnswers,
        readingResult,
        spellingAnswers,
        comprehensionAnswers,
      });
      setScreeningReport(report);
      return report;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScreeningSession = () => {
    setLetterAnswers([]);
    setReadingResultState(null);
    setSpellingAnswers([]);
    setComprehensionAnswers([]);
  };

  return (
    <ScreeningContext.Provider
      value={{
        letterAnswers,
        recordLetterAnswer,
        readingResult,
        setReadingResult,
        spellingAnswers,
        recordSpellingAnswer,
        comprehensionAnswers,
        recordComprehensionAnswer,
        screeningReport,
        isAnalyzing,
        generateReport,
        resetScreeningSession,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
};

export const useScreening = (): ScreeningContextType => {
  const context = useContext(ScreeningContext);
  if (!context) {
    throw new Error('useScreening must be used within a ScreeningProvider');
  }
  return context;
};
