import type { LanguageCode, LanguageScreeningContent } from '../types';
import { enScreeningContent } from './en';
import { taScreeningContent } from './ta';
import { hiScreeningContent } from './hi';

const contentMap: Partial<Record<LanguageCode, LanguageScreeningContent>> = {
  en: enScreeningContent,
  ta: taScreeningContent,
  hi: hiScreeningContent,
};

export function getScreeningContent(language: LanguageCode): LanguageScreeningContent {
  const content = contentMap[language];
  if (content) return content;

  // Fallback to English while marking languageCode so UI knows
  return {
    ...enScreeningContent,
    languageCode: language,
  };
}
