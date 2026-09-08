import type {
  LanguageCode,
  ScreeningReport,
  ScreeningScores,
  SpeechAnalysisResult,
} from '../types';

const STORAGE_KEY = 'akshai_latest_screening_report';

export function evaluateSpelling(
  childInput: string,
  targetWord: string
): { isCorrect: boolean; normalizedChild: string; normalizedTarget: string } {
  const normInput = childInput.trim().toLowerCase();
  const normTarget = targetWord.trim().toLowerCase();
  const isCorrect = normInput === normTarget;

  return {
    isCorrect,
    normalizedChild: normInput,
    normalizedTarget: normTarget,
  };
}

export async function calculateScreeningReport(params: {
  language: LanguageCode;
  letterAnswers: { questionId: string; isCorrect: boolean; timeSeconds: number }[];
  readingResult: SpeechAnalysisResult | null;
  spellingAnswers: { questionId: string; isCorrect: boolean; typedWord: string }[];
  comprehensionAnswers: { questionId: string; isCorrect: boolean }[];
}): Promise<ScreeningReport> {
  // Simulate AI model synthesis latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 1. Letter Recognition Score (out of 100)
  const letterTotal = params.letterAnswers.length || 1;
  const letterCorrect = params.letterAnswers.filter((a) => a.isCorrect).length;
  const letterScore = Math.round((letterCorrect / letterTotal) * 100);

  // 2. Reading Score (from speech analysis or fallback 78%)
  const readingScore = params.readingResult ? params.readingResult.accuracy : 78;

  // 3. Spelling Score
  const spellingTotal = params.spellingAnswers.length || 1;
  const spellingCorrect = params.spellingAnswers.filter((a) => a.isCorrect).length;
  const spellingScore = Math.round((spellingCorrect / spellingTotal) * 100);

  // 4. Comprehension Score
  const compTotal = params.comprehensionAnswers.length || 1;
  const compCorrect = params.comprehensionAnswers.filter((a) => a.isCorrect).length;
  const compScore = Math.round((compCorrect / compTotal) * 100);

  const overallScore = Math.round(
    letterScore * 0.25 + readingScore * 0.35 + spellingScore * 0.2 + compScore * 0.2
  );

  const scores: ScreeningScores = {
    letterRecognition: letterScore,
    readingAccuracy: readingScore,
    spelling: spellingScore,
    comprehension: compScore,
    overallScore,
  };

  // Determine strengths & practice areas dynamically based on child's performance
  const strengths: string[] = [];
  const practiceAreas: string[] = [];

  if (letterScore >= 75) strengths.push('Letter Recognition');
  else practiceAreas.push('Letter Recognition & Mirror Discrimination');

  if (readingScore >= 75) strengths.push('Reading Accuracy & Fluency');
  else practiceAreas.push('Reading Fluency & Consonant Blending');

  if (spellingScore >= 75) strengths.push('Phonetic Spelling');
  else practiceAreas.push('Spelling & Sound-Symbol Encoding');

  if (compScore >= 75) strengths.push('Story Comprehension & Memory');
  else practiceAreas.push('Passage Recall & Active Listening');

  // Ensure there is at least 1 strength and 1 practice area for child encouragement
  if (strengths.length === 0) {
    strengths.push('Story Comprehension & Curiosity');
  }
  if (practiceAreas.length === 0) {
    practiceAreas.push('Advanced Word Exploration & Speed');
  }

  const recommendedGames = [
    'bubble-pop', // Letter Bubble Pop
    'rhyme-safari', // Rhyme Safari
    'mirror-magic', // Mirror Letter Magic
  ];

  const report: ScreeningReport = {
    timestamp: new Date().toISOString(),
    language: params.language,
    scores,
    strengths,
    practiceAreas,
    recommendedGames,
    readingAnalysisDetails: params.readingResult || undefined,
    disclaimer:
      'This screening is an indicative learning-support tool, not a medical diagnosis. If you have concerns about your child’s reading development, please consult a qualified educational psychologist or healthcare professional.',
  };

  saveScreeningReport(report);
  return report;
}

export function saveScreeningReport(report: ScreeningReport): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  }
}

export function getLatestScreeningReport(): ScreeningReport | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore error
      }
    }
  }
  return null;
}
