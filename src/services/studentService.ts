import type {
  ChildProfile,
  ScreeningIndicator,
  GamificationState,
  StudentSummary,
} from '../types';

export const CLASS_METADATA = {
  className: 'Class 3-B',
  grade: 'Class 3',
  teacherName: 'Ms. Deepa Sharma',
  academicYear: '2026-2027',
  subject: 'Language & Foundational Literacy',
};

const MOCK_CLASSMATES: Omit<StudentSummary, 'isActiveChild'>[] = [
  {
    id: 'student-meera',
    name: 'Meera',
    avatarId: 'mayil',
    avatarEmoji: '🦚',
    grade: 'Class 3',
    age: 8,
    readingScore: 61,
    spellingScore: 58,
    letterScore: 72,
    comprehensionScore: 65,
    overallScore: 64,
    weeklyTrend: 3,
    lastActive: 'Yesterday',
    lastActiveKey: 'teacher.roster.yesterday',
    needsPractice: true,
    statusTag: 'needs_practice',
    focusAreas: ['Spelling Patterns', 'Sound Blending'],
    strengths: ['Story Comprehension', 'Visual Recall'],
  },
  {
    id: 'student-arjun',
    name: 'Arjun',
    avatarId: 'sheru',
    avatarEmoji: '🦁',
    grade: 'Class 3',
    age: 9,
    readingScore: 86,
    spellingScore: 79,
    letterScore: 92,
    comprehensionScore: 88,
    overallScore: 86,
    weeklyTrend: 7,
    lastActive: 'Today',
    lastActiveKey: 'teacher.roster.today',
    needsPractice: false,
    statusTag: 'high_progress',
    focusAreas: ['Advanced Vocabulary'],
    strengths: ['Reading Fluency', 'Phonemic Awareness'],
  },
  {
    id: 'student-rohan',
    name: 'Rohan',
    avatarId: 'bandu',
    avatarEmoji: '🐒',
    grade: 'Class 3',
    age: 8,
    readingScore: 55,
    spellingScore: 52,
    letterScore: 68,
    comprehensionScore: 60,
    overallScore: 59,
    weeklyTrend: 4,
    lastActive: '2 days ago',
    lastActiveKey: 'teacher.roster.twoDaysAgo',
    needsPractice: true,
    statusTag: 'needs_practice',
    focusAreas: ['Letter Reversals (b/d)', 'Phonics Blending'],
    strengths: ['Oral Storytelling', 'High Enthusiasm'],
  },
  {
    id: 'student-priya',
    name: 'Priya',
    avatarId: 'gaju',
    avatarEmoji: '🐘',
    grade: 'Class 3',
    age: 8,
    readingScore: 74,
    spellingScore: 70,
    letterScore: 82,
    comprehensionScore: 76,
    overallScore: 75,
    weeklyTrend: 5,
    lastActive: 'Today',
    lastActiveKey: 'teacher.roster.today',
    needsPractice: false,
    statusTag: 'improving',
    focusAreas: ['Spelling Consistency'],
    strengths: ['Letter Discrimination', 'Listening Focus'],
  },
  {
    id: 'student-ananya',
    name: 'Ananya',
    avatarId: 'veera',
    avatarEmoji: '🐯',
    grade: 'Class 3',
    age: 8,
    readingScore: 92,
    spellingScore: 88,
    letterScore: 95,
    comprehensionScore: 91,
    overallScore: 92,
    weeklyTrend: 9,
    lastActive: 'Today',
    lastActiveKey: 'teacher.roster.today',
    needsPractice: false,
    statusTag: 'high_progress',
    focusAreas: ['Expressive Reading'],
    strengths: ['Sight Word Mastery', 'Spelling Fluency'],
  },
  {
    id: 'student-kabir',
    name: 'Kabir',
    avatarId: 'akshu',
    avatarEmoji: '🦉',
    grade: 'Class 3',
    age: 9,
    readingScore: 66,
    spellingScore: 62,
    letterScore: 78,
    comprehensionScore: 71,
    overallScore: 69,
    weeklyTrend: 6,
    lastActive: 'Yesterday',
    lastActiveKey: 'teacher.roster.yesterday',
    needsPractice: false,
    statusTag: 'improving',
    focusAreas: ['Vowel Digraphs'],
    strengths: ['Letter Sounds', 'Curiosity'],
  },
  {
    id: 'student-diya',
    name: 'Diya',
    avatarId: 'mayil',
    avatarEmoji: '🦚',
    grade: 'Class 3',
    age: 7,
    readingScore: 78,
    spellingScore: 74,
    letterScore: 85,
    comprehensionScore: 82,
    overallScore: 80,
    weeklyTrend: 5,
    lastActive: 'Today',
    lastActiveKey: 'teacher.roster.today',
    needsPractice: false,
    statusTag: 'improving',
    focusAreas: ['Pacing & Expression'],
    strengths: ['Reading Speed', 'Comprehension'],
  },
  {
    id: 'student-vikram',
    name: 'Vikram',
    avatarId: 'sheru',
    avatarEmoji: '🦁',
    grade: 'Class 3',
    age: 8,
    readingScore: 58,
    spellingScore: 54,
    letterScore: 69,
    comprehensionScore: 62,
    overallScore: 61,
    weeklyTrend: 4,
    lastActive: '3 days ago',
    lastActiveKey: 'teacher.roster.threeDaysAgo',
    needsPractice: true,
    statusTag: 'needs_practice',
    focusAreas: ['Phoneme Segmentation', 'Sight Words'],
    strengths: ['Listening Comprehension', 'Visual Clues'],
  },
];

/**
 * Builds the complete student roster, binding the live active child's
 * real scores and gamification data into the top of the roster.
 */
export const getClassStudents = (
  activeProfile: ChildProfile,
  indicators: ScreeningIndicator[],
  gamification: GamificationState
): StudentSummary[] => {
  // Extract live indicator values
  const reading = indicators.find((i) =>
    i.skill.toLowerCase().includes('reading') || i.skill.toLowerCase().includes('phonemic')
  )?.score ?? 74;

  const spelling = indicators.find((i) =>
    i.skill.toLowerCase().includes('spelling') || i.skill.toLowerCase().includes('sound blending')
  )?.score ?? 64;

  const letter = indicators.find((i) =>
    i.skill.toLowerCase().includes('letter')
  )?.score ?? 86;

  const comp = indicators.find((i) =>
    i.skill.toLowerCase().includes('comprehension') || i.skill.toLowerCase().includes('visual')
  )?.score ?? 78;

  const overall = Math.round((reading + spelling + letter + comp) / 4);
  const needsPractice = overall < 70 || reading < 68 || spelling < 65;

  let statusTag: 'needs_practice' | 'improving' | 'high_progress' = 'improving';
  if (needsPractice) {
    statusTag = 'needs_practice';
  } else if (overall >= 80) {
    statusTag = 'high_progress';
  }

  const focusAreas: string[] = [];
  if (spelling < 70) focusAreas.push('Spelling Patterns');
  if (reading < 75) focusAreas.push('Reading Fluency');
  if (comp < 75) focusAreas.push('Story Comprehension');
  if (focusAreas.length === 0) focusAreas.push('Advanced Vocabulary');

  const strengths: string[] = [];
  if (letter >= 75) strengths.push('Letter Recognition');
  if (reading >= 75) strengths.push('Reading Accuracy');
  if (comp >= 75) strengths.push('Story Recall');
  if (strengths.length === 0) strengths.push('Visual Memory', 'Consistent Effort');

  const activeStudent: StudentSummary = {
    id: 'active-child',
    name: activeProfile.name || 'Aarav',
    avatarId: activeProfile.avatarId || 'akshu',
    avatarEmoji: activeProfile.avatarId === 'sheru' ? '🦁' : activeProfile.avatarId === 'mayil' ? '🦚' : activeProfile.avatarId === 'gaju' ? '🐘' : activeProfile.avatarId === 'bandu' ? '🐒' : activeProfile.avatarId === 'veera' ? '🐯' : '🦉',
    grade: activeProfile.grade || 'Class 3',
    age: activeProfile.age || 8,
    readingScore: reading,
    spellingScore: spelling,
    letterScore: letter,
    comprehensionScore: comp,
    overallScore: overall,
    weeklyTrend: Math.min(12, Math.max(3, Math.round(gamification.completedQuests * 1.5))),
    lastActive: 'Today',
    lastActiveKey: 'teacher.roster.today',
    needsPractice,
    statusTag,
    focusAreas,
    strengths,
    isActiveChild: true,
  };

  return [activeStudent, ...MOCK_CLASSMATES];
};

/**
 * Filter and search students.
 */
export const filterStudents = (
  students: StudentSummary[],
  filter: 'all' | 'needs_practice' | 'improving' | 'high_progress',
  searchQuery: string = ''
): StudentSummary[] => {
  let result = students;

  if (filter !== 'all') {
    result = result.filter((s) => s.statusTag === filter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.grade.toLowerCase().includes(q) ||
        s.focusAreas.some((f) => f.toLowerCase().includes(q))
    );
  }

  return result;
};
