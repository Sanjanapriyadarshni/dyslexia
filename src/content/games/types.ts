import type { LanguageCode } from '../../types';

export interface LetterMatchItem {
  id: string;
  prompt: string;
  targetLetter: string;
  audioPronunciation: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface WordBuilderItem {
  id: string;
  word: string;
  scrambledLetters: string[];
  meaningEmoji: string;
  clue: string;
  audioPronunciation: string;
}

export interface SpellQuestItem {
  id: string;
  word: string;
  audioPrompt: string;
  meaningEmoji: string;
  clue: string;
  letterBank: string[];
}

export interface ReadAloudItem {
  id: string;
  sentence: string;
  audioPronunciation: string;
  phonemeTokens: { word: string; phonetic: string }[];
  meaningEmoji: string;
  encouragement: string;
}

export interface SoundBuilderOption {
  letter: string;
  sound: string;
  exampleWord: string;
}

export interface SoundBuilderItem {
  id: string;
  soundPrompt: string;
  audioSound: string;
  targetLetter: string;
  options: SoundBuilderOption[];
  correctIndex: number;
  clue: string;
}

export interface StoryQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StoryExplorerItem {
  id: string;
  title: string;
  emoji: string;
  paragraphs: string[];
  audioPrompt: string;
  questions: StoryQuestion[];
}

export interface LanguageGameContent {
  languageCode: LanguageCode;
  letterMatch: LetterMatchItem[];
  wordBuilder: WordBuilderItem[];
  spellQuest: SpellQuestItem[];
  readAloud: ReadAloudItem[];
  soundBuilder: SoundBuilderItem[];
  storyExplorer: StoryExplorerItem[];
}
