import type { GameId, ScreeningIndicator } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Letter Explorer', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Word Adventurer', minXp: 100, maxXp: 250 },
  { level: 3, title: 'Sentence Champion', minXp: 250, maxXp: 500 },
  { level: 4, title: 'Reading Super-Hero', minXp: 500, maxXp: 1000 },
  { level: 5, title: 'Master Storyteller', minXp: 1000, maxXp: 2000 },
];

export function calculateLevel(xp: number): LevelInfo {
  let matched = LEVEL_THRESHOLDS[0];
  for (const tier of LEVEL_THRESHOLDS) {
    if (xp >= tier.minXp) {
      matched = tier;
    }
  }

  const range = matched.maxXp - matched.minXp;
  const earnedInRange = Math.max(0, xp - matched.minXp);
  const progressPercent = Math.min(100, Math.round((earnedInRange / range) * 100));

  return {
    level: matched.level,
    title: matched.title,
    minXp: matched.minXp,
    nextLevelXp: matched.maxXp,
    progressPercent,
  };
}

export function evaluateBadges(state: {
  completedGameIds: string[];
  streakDays: number;
  xp: number;
  totalGamesCount: number;
}): string[] {
  const unlocked = new Set<string>();

  // Always unlocked after first screening/onboarding
  unlocked.add('badge-first-steps');

  if (state.streakDays >= 3) {
    unlocked.add('badge-streak');
  }

  if (state.completedGameIds.includes('letter-match')) {
    unlocked.add('badge-letter-explorer');
  }

  if (state.completedGameIds.includes('word-builder')) {
    unlocked.add('badge-word-builder');
  }

  if (state.completedGameIds.includes('story-explorer')) {
    unlocked.add('badge-story-reader');
  }

  if (state.completedGameIds.includes('read-aloud')) {
    unlocked.add('badge-reading-star');
  }

  if (state.completedGameIds.includes('spell-quest')) {
    unlocked.add('badge-spelling-star');
  }

  if (state.totalGamesCount >= 5 || state.completedGameIds.length >= 4) {
    unlocked.add('badge-champion');
  }

  return Array.from(unlocked);
}

export function simulateSkillProgress(
  gameId: GameId,
  currentIndicators: ScreeningIndicator[]
): {
  updatedIndicators: ScreeningIndicator[];
  skillChanged: string;
  previousScore: number;
  newScore: number;
} {
  // Map Game to primary skill
  const gameToSkill: Record<GameId, string> = {
    'letter-match': 'Letter Recognition',
    'word-builder': 'Sound Blending',
    'spell-quest': 'Sound Blending',
    'read-aloud': 'Phonemic Awareness',
    'sound-builder': 'Phonemic Awareness',
    'story-explorer': 'Visual Tracking',
  };

  const targetSkill = gameToSkill[gameId] || 'Letter Recognition';
  let previousScore = 70;
  let newScore = 74;

  const updatedIndicators = currentIndicators.map((ind) => {
    if (ind.skill.toLowerCase() === targetSkill.toLowerCase()) {
      previousScore = ind.score;
      // Add +4% up to max 98%
      newScore = Math.min(98, ind.score + 4);
      return {
        ...ind,
        score: newScore,
        status: newScore >= 80 ? ('strong' as const) : newScore >= 65 ? ('developing' as const) : ('support_recommended' as const),
      };
    }
    return ind;
  });

  return {
    updatedIndicators,
    skillChanged: targetSkill,
    previousScore,
    newScore,
  };
}
