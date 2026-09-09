import type { ScreeningIndicator, ParentRecommendation, ClassInsight } from '../types';

/**
 * Generates tailored, educational, supportive at-home recommendations
 * for parents based on the child's live indicators.
 * Strictly non-medical, focusing on joyful daily routines.
 */
export const getParentRecommendations = (
  indicators: ScreeningIndicator[]
): ParentRecommendation[] => {
  const recommendations: ParentRecommendation[] = [];

  const readingInd = indicators.find((i) =>
    i.skill.toLowerCase().includes('reading') || i.skill.toLowerCase().includes('phonemic')
  );
  const spellingInd = indicators.find((i) =>
    i.skill.toLowerCase().includes('spelling') || i.skill.toLowerCase().includes('sound blending')
  );
  const compInd = indicators.find((i) =>
    i.skill.toLowerCase().includes('comprehension') || i.skill.toLowerCase().includes('visual')
  );

  const readingScore = readingInd?.score ?? 74;
  const spellingScore = spellingInd?.score ?? 64;
  const compScore = compInd?.score ?? 78;

  // Reading guidance
  if (readingScore < 75) {
    recommendations.push({
      id: 'rec-reading-shared',
      skillId: 'reading',
      title: 'Shared 10-Minute Bedtime Reading',
      description: 'Spend 10 minutes reading a colorful storybook together. Take turns reading alternate sentences and follow words with your finger.',
      category: 'reading',
      suggestedAction: 'Practice Read Aloud Game',
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'rec-reading-explore',
      skillId: 'reading',
      title: 'Encourage Independent Exploration',
      description: 'Your child shows strong reading confidence. Introduce illustrated comics or short chapter books matching their passions.',
      category: 'reading',
      suggestedAction: 'Try Story Explorer',
      priority: 'gentle',
    });
  }

  // Spelling guidance
  if (spellingScore < 75) {
    recommendations.push({
      id: 'rec-spelling-multisensory',
      skillId: 'spelling',
      title: 'Multisensory Letter & Word Fun',
      description: 'Practice 4 to 5 target words each day using play-dough, magnetic letters, or writing in salt trays to strengthen tactile memory.',
      category: 'spelling',
      suggestedAction: 'Launch Word Builder',
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'rec-spelling-rhymes',
      skillId: 'spelling',
      title: 'Rhyme & Word Family Games',
      description: 'Challenge your child with playful rhyming games in the car or kitchen (e.g., cat, bat, mat / பூனை, பானை).',
      category: 'spelling',
      suggestedAction: 'Play Spell Quest',
      priority: 'medium',
    });
  }

  // Comprehension guidance
  if (compScore >= 70) {
    recommendations.push({
      id: 'rec-comp-curiosity',
      skillId: 'comprehension',
      title: 'Curious Story Conversations',
      description: 'Ask open-ended curiosity questions during stories: "Why do you think the owl did that?" or "How would you solve this puzzle?"',
      category: 'comprehension',
      suggestedAction: 'Explore Story Quests',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      id: 'rec-comp-sequencing',
      skillId: 'comprehension',
      title: 'Picture & Story Sequencing',
      description: 'After reading or watching a cartoon, invite your child to summarize what happened first, next, and last.',
      category: 'comprehension',
      suggestedAction: 'Practice Visual Tracking',
      priority: 'high',
    });
  }

  // Positive encouragement
  recommendations.push({
    id: 'rec-habits-praise',
    skillId: 'habits',
    title: 'Celebrate Effort & Daily Streaks',
    description: 'Praise patience and bravery when tackling tough words rather than perfection. Consistent 10-minute sessions yield huge confidence.',
    category: 'habits',
    suggestedAction: 'View Milestones & Badges',
    priority: 'gentle',
  });

  return recommendations;
};

/**
 * Aggregated insights for the teacher dashboard.
 */
export const getClassInsights = (): ClassInsight[] => [
  {
    id: 'insight-1',
    type: 'improvement',
    icon: '📈',
    title: 'Reading Fluency on the Rise',
    metric: '8 students',
    description: 'Demonstrated measurable gains in reading pace and syllable recognition over the past 7 days.',
    actionHint: 'Continue 10-min buddy-reading sessions',
  },
  {
    id: 'insight-2',
    type: 'focus_area',
    icon: '✍️',
    title: 'Common Reinforcement Area',
    metric: 'Phonetic Spelling Patterns',
    description: '6 students would benefit from small-group practice with vowel teams and consonant blends.',
    actionHint: 'Assign Word Builder and Spell Quest quests',
  },
  {
    id: 'insight-3',
    type: 'engagement',
    icon: '🏆',
    title: 'High Engagement & Practice Streaks',
    metric: '12 students',
    description: 'Completed 5+ learning quests this week with positive streaks.',
    actionHint: 'Award classroom recognition certificates',
  },
];
