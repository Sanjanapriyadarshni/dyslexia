import React from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { ScreeningProvider } from './context/ScreeningContext';
import { Navbar } from './components/common/Navbar';
import { SplashScreen } from './components/screens/SplashScreen';
import { LanguageSelectScreen } from './components/screens/LanguageSelectScreen';
import { ProfileSetupScreen } from './components/screens/ProfileSetupScreen';
import { HomeDashboardScreen } from './components/screens/HomeDashboardScreen';
import { ScreeningIntroScreen } from './components/screening/ScreeningIntroScreen';
import { LetterRecognitionScreen } from './components/screening/LetterRecognitionScreen';
import { ReadingTestScreen } from './components/screening/ReadingTestScreen';
import { SpellingTestScreen } from './components/screening/SpellingTestScreen';
import { ComprehensionTestScreen } from './components/screening/ComprehensionTestScreen';
import { ScreeningAnalysisScreen } from './components/screening/ScreeningAnalysisScreen';
import { LearningProfileScreen } from './components/screening/LearningProfileScreen';
import {
  PersonalizedDashboard,
  GameHub,
  LetterMatchGame,
  WordBuilderGame,
  SpellQuestGame,
  ReadAloudGame,
  SoundBuilderGame,
  StoryExplorerGame,
} from './components/learning';
import { ParentDashboard } from './components/parent';
import { TeacherDashboard } from './components/teacher';
import { RotateCcw, ShieldCheck } from 'lucide-react';

const ScreenContent: React.FC = () => {
  const { currentScreen, resetDemoData } = useProfile();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Dynamic Screen */}
      <main className="flex-1 transition-all duration-300">
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'language-select' && <LanguageSelectScreen />}
        {currentScreen === 'profile-setup' && <ProfileSetupScreen />}
        {currentScreen === 'home' && <HomeDashboardScreen />}

        {/* Core Dyslexia Screening Flow */}
        {currentScreen === 'screening-intro' && <ScreeningIntroScreen />}
        {currentScreen === 'screening-letter' && <LetterRecognitionScreen />}
        {currentScreen === 'screening-reading' && <ReadingTestScreen />}
        {currentScreen === 'screening-spelling' && <SpellingTestScreen />}
        {currentScreen === 'screening-comprehension' && <ComprehensionTestScreen />}
        {currentScreen === 'screening-analysis' && <ScreeningAnalysisScreen />}
        {currentScreen === 'learning-profile' && <LearningProfileScreen />}

        {/* Personalized Learning & Gamification Adventure */}
        {currentScreen === 'learning-dashboard' && <PersonalizedDashboard />}
        {currentScreen === 'game-hub' && <GameHub />}
        {currentScreen === 'game-letter-match' && <LetterMatchGame />}
        {currentScreen === 'game-word-builder' && <WordBuilderGame />}
        {currentScreen === 'game-spell-quest' && <SpellQuestGame />}
        {currentScreen === 'game-read-aloud' && <ReadAloudGame />}
        {currentScreen === 'game-sound-builder' && <SoundBuilderGame />}
        {currentScreen === 'game-story-explorer' && <StoryExplorerGame />}

        {/* Parent and Teacher Dashboards */}
        {currentScreen === 'parent-dashboard' && <ParentDashboard />}
        {currentScreen === 'teacher-dashboard' && <TeacherDashboard />}
      </main>

      {/* Modern Child-Friendly Footer */}
      <footer className="mt-12 border-t-2 border-slate-200/80 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦉</span>
            <div>
              <span className="font-extrabold text-slate-800 text-sm">AkshAI</span> —{' '}
              <span>{t('app.tagline')}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                AI-powered gamified screening & learning prototype for children aged 6–12
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('app.nonMedicalBadge')}</span>
            </div>

            <button
              onClick={resetDemoData}
              title="Reset profile and demo data"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <ScreeningProvider>
          <ScreenContent />
        </ScreeningProvider>
      </ProfileProvider>
    </LanguageProvider>
  );
}

export default App;
