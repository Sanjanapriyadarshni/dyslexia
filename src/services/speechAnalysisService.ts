import type { LanguageCode, SpeechAnalysisResult } from '../types';

/**
 * Speech Analysis Service (Mock AI Layer)
 * 
 * ARCHITECTURAL NOTE:
 * This service encapsulates speech processing and phonemic alignment for the Reading Test.
 * It is decoupled from UI components so it can be swapped with real-time Speech-to-Text,
 * Whisper API, Google Cloud Speech-to-Text, or Gemini Multimodal Live API in production.
 */

export async function analyzeReadingSpeech(
  targetSentence: string,
  language: LanguageCode,
  durationSeconds: number = 4
): Promise<SpeechAnalysisResult> {
  // Simulate network & AI model inference latency (1.2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const words = targetSentence.trim().split(/\s+/);
  const totalWords = words.length;

  // Language-aware pattern observations
  const patternsByLang: Record<string, string> = {
    en: 'Mild hesitation observed around consonant clusters ("sl-", "cl-"). Strong vowel recognition.',
    ta: 'மெய்மயக்கம் மற்றும் ஒற்றுப் பிழைகளில் சிறு தயக்கம் காணப்பட்டது. உயிர்மெய் எழுத்துக்கள் நன்று.',
    hi: 'संयुक्त वर्णों के उच्चारण में थोड़ी झिझक। स्वर पहचान बहुत अच्छी है।',
  };

  const possiblePattern =
    patternsByLang[language] ||
    'Good overall phonological awareness with slight hesitation on complex consonant blends.';

  // Build simulated per-word phonetic alignment
  // For prototype demonstration: mark 70-85% of words as correct and a couple as hesitation
  const wordsBreakdown = words.map((word, idx) => {
    if (idx === 1 || idx === words.length - 2) {
      return { word, status: 'hesitation' as const };
    }
    return { word, status: 'correct' as const };
  });

  const correctCount = wordsBreakdown.filter((w) => w.status === 'correct').length;
  const accuracy = Math.round((correctCount / totalWords) * 100);
  const readingRateWpm = Math.round((totalWords / Math.max(durationSeconds, 2)) * 60);

  return {
    accuracy: Math.max(72, accuracy),
    wordsReadCorrectly: correctCount,
    totalWords,
    wordsBreakdown,
    readingRateWpm,
    possiblePattern,
    durationSeconds,
  };
}
