import type { ScreeningIndicator, WeeklyProgressPoint, SkillOverviewItem } from '../types';

/**
 * Generates 7 days of historical progress culminating in today's live score.
 * Whenever games or screening update the live score, today's value reflects it.
 */
export const generateWeeklyProgress = (
  indicators: ScreeningIndicator[],
  streakDays: number = 3
): WeeklyProgressPoint[] => {
  // Extract live indicator values (defaulting gracefully if not found)
  const readingIndicator = indicators.find((i) =>
    i.skill.toLowerCase().includes('reading') || i.skill.toLowerCase().includes('phonemic')
  );
  const spellingIndicator = indicators.find((i) =>
    i.skill.toLowerCase().includes('spelling') || i.skill.toLowerCase().includes('sound blending')
  );
  const letterIndicator = indicators.find((i) =>
    i.skill.toLowerCase().includes('letter')
  );
  const comprehensionIndicator = indicators.find((i) =>
    i.skill.toLowerCase().includes('comprehension') || i.skill.toLowerCase().includes('visual')
  );

  const currentReading = readingIndicator?.score ?? 74;
  const currentSpelling = spellingIndicator?.score ?? 64;
  const currentLetter = letterIndicator?.score ?? 86;
  const currentComp = comprehensionIndicator?.score ?? 78;

  // Day labels for the last 7 days (e.g. Day 1 was 6-10 points lower)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Growth curve offsets from day 1 to day 7 (0 to 1)
  const growthCurve = [0.84, 0.87, 0.90, 0.93, 0.96, 0.98, 1.0];

  return days.map((day, idx) => {
    const factor = growthCurve[idx];
    const isToday = idx === 6;

    return {
      day,
      fullDate: `Day ${idx + 1}`,
      reading: Math.round(currentReading * factor),
      spelling: Math.round(currentSpelling * factor),
      letterRecognition: Math.round(currentLetter * factor),
      comprehension: Math.round(currentComp * factor),
      practiceTimeMinutes: isToday
        ? 24
        : idx < streakDays
        ? 15 + (idx * 3)
        : Math.max(10, (idx * 4)),
    };
  });
};

/**
 * Calculates skill overview items with current score, previous week score, and delta (+X%).
 */
export const calculateSkillOverview = (
  indicators: ScreeningIndicator[]
): SkillOverviewItem[] => {
  return indicators.map((ind) => {
    const current = ind.score;
    // Derive realistic previous baseline (e.g. 5-10% lower)
    const delta = Math.max(3, Math.round(current * 0.08));
    const previous = Math.max(20, current - delta);
    const change = current - previous;

    let color = 'text-teal-600 bg-teal-50 border-teal-200';
    if (ind.status === 'support_recommended') {
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (ind.status === 'strong') {
      color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }

    return {
      id: ind.skill.toLowerCase().replace(/\s+/g, '-'),
      name: ind.skill,
      score: current,
      previousScore: previous,
      changePercent: change,
      status: ind.status,
      color,
    };
  });
};
