import type { LanguageScreeningContent } from '../types';

export const hiScreeningContent: LanguageScreeningContent = {
  languageCode: 'hi',
  letterQuestions: [
    {
      id: 'hi-l1',
      prompt: 'नीचे दिए गए विकल्पों में से "ब" अक्षर चुनें:',
      targetLetter: 'ब',
      audioPronunciation: 'ब',
      options: ['व', 'ब', 'क', 'प'],
      correctIndex: 1,
      explanation: 'शाबाश! "ब" के बीच में एक तिरछी रेखा होती है।',
    },
    {
      id: 'hi-l2',
      prompt: 'नीचे दिए गए विकल्पों में से "घ" अक्षर पहचानें:',
      targetLetter: 'घ',
      audioPronunciation: 'घ',
      options: ['ध', 'घ', 'छ', 'थ'],
      correctIndex: 1,
      explanation: 'बहुत अच्छे! "घ" ऊपर से पूरा ढका होता है।',
    },
    {
      id: 'hi-l3',
      prompt: 'नीचे दिए गए विकल्पों में से "स" अक्षर चुनें:',
      targetLetter: 'स',
      audioPronunciation: 'स',
      options: ['म', 'भ', 'स', 'ग'],
      correctIndex: 2,
      explanation: 'बढ़िया! "स" सपेरा अक्षर सही पहचाना।',
    },
  ],
  readingTask: {
    id: 'hi-r1',
    sentence: 'छोटी बिल्ली धूप वाले सुंदर बगीचे में शांति से सो रही है।',
    audioPronunciation: 'छोटी बिल्ली धूप वाले सुंदर बगीचे में शांति से सो रही है।',
    wordCount: 11,
    phonemeHighlights: ['छो-टी', 'बिल्-ली', 'ब-गी-चे', 'शां-ति'],
  },
  spellingQuestions: [
    {
      id: 'hi-s1',
      word: 'कमल',
      audioPrompt: 'कमल',
      hint: 'तालाब में खिलने वाला हमारा राष्ट्रीय फूल (3 अक्षर)',
    },
    {
      id: 'hi-s2',
      word: 'घर',
      audioPrompt: 'घर',
      hint: 'जहाँ हम अपने परिवार के साथ रहते हैं (2 अक्षर)',
    },
    {
      id: 'hi-s3',
      word: 'सूरज',
      audioPrompt: 'सूरज',
      hint: 'आसमान में रोशनी देने वाला सुनहरा तारा',
    },
  ],
  comprehensionPassage: {
    id: 'hi-c1',
    title: 'ब्रूनो और सुनहरी गेंद',
    story:
      'ब्रूनो नाम के एक प्यारे छोटे पिल्ले को एक बड़े आम के पेड़ के नीचे एक चमकदार सुनहरी गेंद मिली। उसने खुशी से अपनी पूँछ हिलाई और अपनी सबसे अच्छी दोस्त माया को दिखाने के लिए बगीचे में दौड़ पड़ा।',
    audioPrompt:
      'ब्रूनो नाम के एक प्यारे छोटे पिल्ले को एक बड़े आम के पेड़ के नीचे एक चमकदार सुनहरी गेंद मिली। उसने खुशी से अपनी पूँछ हिलाई और अपनी सबसे अच्छी दोस्त माया को दिखाने के लिए बगीचे में दौड़ पड़ा।',
    questions: [
      {
        id: 'hi-c1-q1',
        question: 'ब्रूनो को सुनहरी गेंद कहाँ मिली?',
        options: ['एक बड़े आम के पेड़ के नीचे', 'रसोई घर में', 'नदी के पानी में', 'स्कूल के पास'],
        correctIndex: 0,
      },
      {
        id: 'hi-c1-q2',
        question: 'ब्रूनो अपनी गेंद दिखाने किसके पास दौड़ा?',
        options: ['अपनी दोस्त माया के पास', 'एक सोती हुई बिल्ली के पास', 'चिड़िया के पास', 'डाकिए के पास'],
        correctIndex: 0,
      },
    ],
  },
};
