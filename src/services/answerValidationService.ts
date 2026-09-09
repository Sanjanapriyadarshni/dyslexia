/**
 * Answer Validation Service for AkshAI
 * 
 * Centralized, reusable answer validation logic for all interactive games.
 * Supports robust Unicode normalization (NFC), whitespace trimming,
 * English case-insensitivity, and authentic Tamil / Indic character comparison.
 */

export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  normalizedUserAnswer: string;
  normalizedCorrectAnswer: string;
  accuracyPercentage?: number;
  wordMatches?: {
    word: string;
    expected: string;
    isMatch: boolean;
  }[];
}

/**
 * Normalizes text for comparison:
 * - NFC Unicode normalization (critical for Tamil vowel signs, pulli, combined glyphs)
 * - Trims accidental leading/trailing whitespaces
 * - Collapses internal multiple spaces
 * - Lowercases if English (or Latin-based)
 */
export function normalizeString(str: string, isEnglish: boolean = false): string {
  if (!str) return '';
  let normalized = str.normalize('NFC').trim().replace(/\s+/g, ' ');
  if (isEnglish) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

/**
 * Validates Multiple Choice selection (Letter Match, Sound Builder, Story Explorer)
 */
export function validateMultipleChoiceAnswer(
  userSelection: string | number,
  correctTarget: string | number,
  language: string = 'en'
): ValidationResult {
  const isEn = language === 'en';

  if (typeof userSelection === 'number' && typeof correctTarget === 'number') {
    const isCorrect = userSelection === correctTarget;
    return {
      isCorrect,
      feedback: isCorrect
        ? (isEn ? '✓ Great job! Correct!' : '✓ மிகச் சிறப்பு! சரியான விடை!')
        : (isEn ? 'Not quite! Try again.' : 'சரியாக இல்லை! மீண்டும் முயற்சிக்கவும்.'),
      normalizedUserAnswer: String(userSelection),
      normalizedCorrectAnswer: String(correctTarget),
    };
  }

  const normUser = normalizeString(String(userSelection), isEn);
  const normCorrect = normalizeString(String(correctTarget), isEn);
  const isCorrect = normUser === normCorrect;

  return {
    isCorrect,
    feedback: isCorrect
      ? (isEn ? '✓ Great job! Correct!' : '✓ மிகச் சிறப்பு! சரியான விடை!')
      : (isEn ? 'Not quite! Try again.' : 'சரியாக இல்லை! மீண்டும் முயற்சிக்கவும்.'),
    normalizedUserAnswer: normUser,
    normalizedCorrectAnswer: normCorrect,
  };
}

/**
 * Validates Text Input (Spell Quest)
 * - Ignores accidental whitespace
 * - Handles English case-insensitivity
 * - Preserves Tamil Unicode characters strictly
 * - Rejects different words
 */
export function validateTextAnswer(
  userText: string,
  expectedText: string,
  language: string = 'en'
): ValidationResult {
  const isEn = language === 'en';
  const normUser = normalizeString(userText, isEn);
  const normExpected = normalizeString(expectedText, isEn);

  const isCorrect = normUser === normExpected;

  let feedback = '';
  if (isCorrect) {
    feedback = isEn ? '✓ Great job! Perfect spelling!' : '✓ மிக அருமை! சரியான எழுத்துக்கூட்டல்!';
  } else {
    feedback = isEn
      ? 'Good try! Listen again and try once more.'
      : 'நல்ல முயற்சி! மீண்டும் கேட்டு விட்டுச் சரியாக எழுதவும்.';
  }

  return {
    isCorrect,
    feedback,
    normalizedUserAnswer: normUser,
    normalizedCorrectAnswer: normExpected,
  };
}

/**
 * Validates Word Builder tiles assembly (Word Builder)
 * - Combines placed tiles into a Unicode string
 * - Compares with target word
 */
export function validateWordBuilderAnswer(
  userTiles: string[],
  targetWord: string,
  language: string = 'en'
): ValidationResult {
  const assembled = userTiles.join('');
  const isEn = language === 'en';
  const normUser = normalizeString(assembled, isEn);
  const normTarget = normalizeString(targetWord, isEn);

  const isCorrect = normUser === normTarget;

  let feedback = '';
  if (isCorrect) {
    feedback = isEn ? '✓ Awesome! You built the word!' : '✓ அற்புதம்! சொல்லைச் சரியாக உருவாக்கினீர்கள்!';
  } else {
    feedback = isEn
      ? 'Not quite! Rearrange the letters and try again.'
      : 'சரியாக அமையவில்லை! எழுத்துக்களை மாற்றி மீண்டும் அடுக்கவும்.';
  }

  return {
    isCorrect,
    feedback,
    normalizedUserAnswer: normUser,
    normalizedCorrectAnswer: normTarget,
  };
}

/**
 * Validates Speech Recognition against Expected Sentence (Read Aloud)
 * - Compares mock recognized text with expected sentence
 * - Tokenizes words, identifies mismatches, calculates accuracy %
 */
export function validateSpeechReading(
  spokenSentence: string,
  targetSentence: string,
  language: string = 'en'
): ValidationResult {
  const isEn = language === 'en';
  const normSpoken = normalizeString(spokenSentence, isEn);
  const normTarget = normalizeString(targetSentence, isEn);

  // Clean punctuation for word-level matching
  const cleanWord = (w: string) => w.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'!’]/g, '').trim();

  const spokenWords = normSpoken.split(' ').map(cleanWord).filter(Boolean);
  const targetWords = normTarget.split(' ').map(cleanWord).filter(Boolean);

  let matchCount = 0;
  const wordMatches = targetWords.map((expectedWord, idx) => {
    const spoken = spokenWords[idx] || '';
    const isMatch = spoken === expectedWord;
    if (isMatch) matchCount++;
    return {
      word: spoken || '(omitted)',
      expected: expectedWord,
      isMatch,
    };
  });

  const accuracyPercentage = targetWords.length > 0
    ? Math.round((matchCount / targetWords.length) * 100)
    : 0;

  // Reading is considered acceptable pass if accuracy >= 75%
  const isCorrect = accuracyPercentage >= 75;

  let feedback = '';
  if (accuracyPercentage >= 90) {
    feedback = isEn
      ? '✓ Incredible reading! Crystal clear and accurate!'
      : '✓ அருமையான வாசிப்பு! மிகத் தெளிவான உச்சரிப்பு!';
  } else if (accuracyPercentage >= 75) {
    feedback = isEn
      ? '✓ Good reading! A few words were a bit tricky, but great flow!'
      : '✓ நல்ல வாசிப்பு! சில சொற்களை இன்னும் கவனமாகப் படிக்கலாம்!';
  } else {
    feedback = isEn
      ? 'Listen carefully to the guide and try reading once more.'
      : 'ஒலியை மீண்டும் கேட்டு வாக்கியத்தை இன்னொரு முறை படியுங்கள்.';
  }

  return {
    isCorrect,
    accuracyPercentage,
    feedback,
    normalizedUserAnswer: normSpoken,
    normalizedCorrectAnswer: normTarget,
    wordMatches,
  };
}
