export type LanguageCode =
  | 'en'
  | 'ta'
  | 'hi'
  | 'te'
  | 'kn'
  | 'ml'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'or'
  | 'as';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr' | 'rtl';
  availability: 'full' | 'beta' | 'preview';
  sampleGreeting: string;
  region: string;
}

export type ScreenType =
  | 'splash'
  | 'language-select'
  | 'profile-setup'
  | 'home'
  | 'screening-intro'
  | 'screening-letter'
  | 'screening-reading'
  | 'screening-spelling'
  | 'screening-comprehension'
  | 'screening-analysis'
  | 'learning-profile'
  | 'learning-dashboard'
  | 'game-hub'
  | 'game-letter-match'
  | 'game-word-builder'
  | 'game-spell-quest'
  | 'game-read-aloud'
  | 'game-sound-builder'
  | 'game-story-explorer';

export interface Avatar {
  id: string;
  name: string;
  role: string;
  color: string;
  bgGradient: string;
  emoji: string;
  description: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  grade: string;
  preferredLanguage: LanguageCode;
  avatarId: string;
  isConfigured: boolean;
}

export interface GamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  completedQuests: number;
  stars: number;
  unlockedBadgeIds: string[];
  completedGameIds: string[];
}

export type GameId =
  | 'letter-match'
  | 'word-builder'
  | 'spell-quest'
  | 'read-aloud'
  | 'sound-builder'
  | 'story-explorer';

export interface GameMetadata {
  id: GameId;
  screenId: ScreenType;
  titleKey: string;
  descKey: string;
  skillKey: string;
  skillName: string;
  emoji: string;
  color: string;
  bgGradient: string;
  difficulty: number;
  estimatedMinutes: number;
  xpReward: number;
  minLevelRequired: number;
}

export interface GameRecommendation {
  game: GameMetadata;
  reasonKey: string;
  reasonExplanation: string;
  priority: 'high' | 'medium' | 'general';
  skillScore: number;
}

export interface Badge {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  color: string;
}

export interface ScreeningIndicator {
  skill: string;
  score: number;
  target: number;
  fullMark: number;
  status: 'strong' | 'developing' | 'support_recommended';
}

export interface LearningGame {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  color: string;
  duration: string;
  xpReward: number;
}

// -------------------------------------------------------------
// Core Dyslexia Screening Flow Types
// -------------------------------------------------------------

export interface LetterQuestion {
  id: string;
  prompt: string;
  targetLetter: string;
  audioPronunciation: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface ReadingTask {
  id: string;
  sentence: string;
  audioPronunciation: string;
  wordCount: number;
  phonemeHighlights: string[];
}

export interface SpeechAnalysisResult {
  accuracy: number;
  wordsReadCorrectly: number;
  totalWords: number;
  wordsBreakdown: {
    word: string;
    status: 'correct' | 'hesitation' | 'mispronounced';
  }[];
  readingRateWpm: number;
  possiblePattern: string;
  durationSeconds: number;
}

export interface SpellingQuestion {
  id: string;
  word: string;
  audioPrompt: string;
  hint: string;
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ComprehensionPassage {
  id: string;
  title: string;
  story: string;
  audioPrompt?: string;
  questions: ComprehensionQuestion[];
}

export interface LanguageScreeningContent {
  languageCode: LanguageCode;
  letterQuestions: LetterQuestion[];
  readingTask: ReadingTask;
  spellingQuestions: SpellingQuestion[];
  comprehensionPassage: ComprehensionPassage;
}

export interface ScreeningScores {
  letterRecognition: number;
  readingAccuracy: number;
  spelling: number;
  comprehension: number;
  overallScore: number;
}

export interface ScreeningReport {
  timestamp: string;
  language: LanguageCode;
  scores: ScreeningScores;
  strengths: string[];
  practiceAreas: string[];
  recommendedGames: string[];
  readingAnalysisDetails?: SpeechAnalysisResult;
  disclaimer: string;
}
