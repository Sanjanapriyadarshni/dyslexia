import type { GameRecommendation, ScreeningIndicator, ScreeningReport, GameId } from '../types';
import { ALL_GAMES_METADATA } from '../data/mockData';

/**
 * Recommendation Service
 * 
 * Generates personalized learning recommendations based on the child's
 * screening indicators and skill performance. Weakest areas are prioritized
 * with pedagogical rationales.
 */

export function getPersonalizedRecommendations(
  screeningReport: ScreeningReport | null,
  indicators: ScreeningIndicator[]
): GameRecommendation[] {
  // Extract skill scores from screening report or indicators
  const scores: Record<string, number> = {
    reading: 72,
    spelling: 64,
    letter: 86,
    comprehension: 81,
  };

  if (screeningReport?.scores) {
    scores.reading = screeningReport.scores.readingAccuracy;
    scores.spelling = screeningReport.scores.spelling;
    scores.letter = screeningReport.scores.letterRecognition;
    scores.comprehension = screeningReport.scores.comprehension;
  } else if (indicators && indicators.length > 0) {
    indicators.forEach((ind) => {
      const lower = ind.skill.toLowerCase();
      if (lower.includes('reading') || lower.includes('phonemic')) scores.reading = ind.score;
      else if (lower.includes('spelling') || lower.includes('blending')) scores.spelling = ind.score;
      else if (lower.includes('letter')) scores.letter = ind.score;
      else if (lower.includes('visual') || lower.includes('comprehension')) scores.comprehension = ind.score;
    });
  }

  // Find lowest score
  const sortedSkills = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const weakestSkill = sortedSkills[0][0];

  // Map skill to top game
  const skillToGameMap: Record<string, { topGameId: GameId; reasonKey: string; reasonExplanation: string }> = {
    reading: {
      topGameId: 'read-aloud',
      reasonKey: 'learning.recommendations.readingReason',
      reasonExplanation: 'Recommended because reading fluency is currently your best opportunity for improvement.',
    },
    spelling: {
      topGameId: 'spell-quest',
      reasonKey: 'learning.recommendations.spellingReason',
      reasonExplanation: 'Recommended to strengthen word spelling, letter combinations, and sound-symbol memory.',
    },
    letter: {
      topGameId: 'letter-match',
      reasonKey: 'learning.recommendations.letterReason',
      reasonExplanation: 'Recommended to practice letter orientation, visual patterns, and tricky letter twins.',
    },
    comprehension: {
      topGameId: 'story-explorer',
      reasonKey: 'learning.recommendations.comprehensionReason',
      reasonExplanation: 'Recommended to boost story recall, paragraph context clues, and active reading curiosity.',
    },
  };

  const topChoice = skillToGameMap[weakestSkill] || skillToGameMap.reading;

  const recommendations: GameRecommendation[] = [];

  // 1. Top High-Priority Recommendation
  const topGame = ALL_GAMES_METADATA.find((g) => g.id === topChoice.topGameId);
  if (topGame) {
    recommendations.push({
      game: topGame,
      reasonKey: topChoice.reasonKey,
      reasonExplanation: topChoice.reasonExplanation,
      priority: 'high',
      skillScore: scores[weakestSkill] || 65,
    });
  }

  // 2. Secondary recommendations (Word Builder & Sound Builder / remaining skills)
  const secondarySkills = sortedSkills.slice(1);
  secondarySkills.forEach(([skillKey, score]) => {
    const config = skillToGameMap[skillKey];
    if (config) {
      const g = ALL_GAMES_METADATA.find((item) => item.id === config.topGameId);
      if (g && !recommendations.some((r) => r.game.id === g.id)) {
        recommendations.push({
          game: g,
          reasonKey: config.reasonKey,
          reasonExplanation: config.reasonExplanation,
          priority: score < 75 ? 'medium' : 'general',
          skillScore: score,
        });
      }
    }
  });

  // Always include Word Builder and Sound Builder if not yet included
  const wordBuilder = ALL_GAMES_METADATA.find((g) => g.id === 'word-builder');
  if (wordBuilder && !recommendations.some((r) => r.game.id === 'word-builder')) {
    recommendations.push({
      game: wordBuilder,
      reasonKey: 'learning.recommendations.wordBuilderReason',
      reasonExplanation: 'Fun activity to practice arranging letters into words.',
      priority: 'medium',
      skillScore: scores.spelling || 70,
    });
  }

  const soundBuilder = ALL_GAMES_METADATA.find((g) => g.id === 'sound-builder');
  if (soundBuilder && !recommendations.some((r) => r.game.id === 'sound-builder')) {
    recommendations.push({
      game: soundBuilder,
      reasonKey: 'learning.recommendations.soundBuilderReason',
      reasonExplanation: 'Connect phonemes and spoken sounds with interactive letter cards.',
      priority: 'general',
      skillScore: scores.letter || 75,
    });
  }

  return recommendations;
}
