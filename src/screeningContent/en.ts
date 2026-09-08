import type { LanguageScreeningContent } from '../types';

export const enScreeningContent: LanguageScreeningContent = {
  languageCode: 'en',
  letterQuestions: [
    {
      id: 'en-l1',
      prompt: 'Look at the letter. Which one matches the target sound "b" as in "ball"?',
      targetLetter: 'b',
      audioPronunciation: 'b',
      options: ['d', 'b', 'p', 'q'],
      correctIndex: 1,
      explanation: 'Great job! "b" has its belly pointing forward to the right.',
    },
    {
      id: 'en-l2',
      prompt: 'Which letter matches the target sound "m" as in "monkey"?',
      targetLetter: 'm',
      audioPronunciation: 'm',
      options: ['w', 'n', 'm', 'u'],
      correctIndex: 2,
      explanation: 'Super! "m" has two friendly bumps on top.',
    },
    {
      id: 'en-l3',
      prompt: 'Which letter matches the target sound "s" as in "sun"?',
      targetLetter: 's',
      audioPronunciation: 's',
      options: ['c', 'z', 's', 'x'],
      correctIndex: 2,
      explanation: 'Wonderful! "s" slithers like a little snake.',
    },
  ],
  readingTask: {
    id: 'en-r1',
    sentence: 'The little cat is sleeping in the sunny garden.',
    audioPronunciation: 'The little cat is sleeping in the sunny garden.',
    wordCount: 9,
    phonemeHighlights: ['lit-tle', 'sleep-ing', 'sun-ny', 'gar-den'],
  },
  spellingQuestions: [
    {
      id: 'en-s1',
      word: 'sun',
      audioPrompt: 'sun',
      hint: 'The bright star in the morning sky (3 letters)',
    },
    {
      id: 'en-s2',
      word: 'ship',
      audioPrompt: 'ship',
      hint: 'A large boat that sails on the ocean (starts with "sh")',
    },
    {
      id: 'en-s3',
      word: 'frog',
      audioPrompt: 'frog',
      hint: 'A green animal that loves to hop and jump (starts with "fr")',
    },
  ],
  comprehensionPassage: {
    id: 'en-c1',
    title: 'Bruno and the Golden Ball',
    story:
      'A cheerful little puppy named Bruno found a shiny golden ball under a big mango tree. He picked it up gently, wagged his tail with joy, and ran across the green lawn to share it with his best friend, Maya.',
    audioPrompt:
      'A cheerful little puppy named Bruno found a shiny golden ball under a big mango tree. He picked it up gently, wagged his tail with joy, and ran across the green lawn to share it with his best friend, Maya.',
    questions: [
      {
        id: 'en-c1-q1',
        question: 'Where did Bruno find the golden ball?',
        options: ['Under a big mango tree', 'Inside the kitchen', 'Floating in the pond', 'On a high roof'],
        correctIndex: 0,
      },
      {
        id: 'en-c1-q2',
        question: 'Who did Bruno run across the lawn to see?',
        options: ['His best friend Maya', 'A sleeping kitten', 'A little bird', 'The mail carrier'],
        correctIndex: 0,
      },
    ],
  },
};
