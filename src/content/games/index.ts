import type { LanguageCode } from '../../types';
import type { LanguageGameContent } from './types';
import { enGameContent } from './en';
import { taGameContent } from './ta';

const GAME_CONTENT_REGISTRY: Partial<Record<LanguageCode, LanguageGameContent>> = {
  en: enGameContent,
  ta: taGameContent,
};

export function getGameContent(language: LanguageCode): LanguageGameContent {
  return GAME_CONTENT_REGISTRY[language] || enGameContent;
}

export * from './types';
export { enGameContent, taGameContent };
