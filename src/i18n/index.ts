import type { LanguageCode } from '../types';
import en from './translations/en.json';
import ta from './translations/ta.json';
import hi from './translations/hi.json';
import te from './translations/te.json';
import kn from './translations/kn.json';
import ml from './translations/ml.json';
import bn from './translations/bn.json';
import mr from './translations/mr.json';
import gu from './translations/gu.json';
import pa from './translations/pa.json';
import or_trans from './translations/or.json';
import as_trans from './translations/as.json';

// Comprehensive dictionary mapping for all 12 Indian languages
export const translationsMap: Record<LanguageCode, Record<string, any>> = {
  en,
  ta,
  hi,
  te,
  kn,
  ml,
  bn,
  mr,
  gu,
  pa,
  or: or_trans,
  as: as_trans,
};

/**
 * Helper to traverse nested objects using dot notation, e.g. 'home.screeningCard.title'
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}

/**
 * Core translation resolver with automatic fallback to English and parameter replacement.
 */
export function getTranslation(
  lang: LanguageCode,
  key: string,
  params?: Record<string, string | number>
): string {
  const currentLangObj = translationsMap[lang] || translationsMap['en'];
  let val = getNestedValue(currentLangObj, key);

  // Fall back to English if missing in target language
  if (val === undefined && lang !== 'en') {
    val = getNestedValue(translationsMap['en'], key);
  }

  // If still not found, return the last piece of the key as readable text
  if (val === undefined) {
    const fallback = key.split('.').pop() || key;
    return fallback;
  }

  // If value is not a string (e.g., array or object), return as is or stringified
  if (typeof val !== 'string') {
    return val;
  }

  // Replace parameter placeholders e.g. {language}, {name}, {count}
  if (params) {
    Object.entries(params).forEach(([pKey, pVal]) => {
      val = (val as string).replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    });
  }

  return val;
}
