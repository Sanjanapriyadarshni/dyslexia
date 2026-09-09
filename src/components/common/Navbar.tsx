import React, { useState } from 'react';
import { Globe, Sparkles, Flame, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { RoleSwitcher } from './RoleSwitcher';
import type { ScreenType } from '../../types';

export const Navbar: React.FC = () => {
  const { currentLanguage, languageConfig, setLanguage, languages, t } = useLanguage();
  const { profile, avatar, gamification, currentScreen, setScreen, userRole } = useProfile();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const childScreens: { id: ScreenType; labelKey: string }[] = [
    { id: 'splash', labelKey: 'nav.splash' },
    { id: 'language-select', labelKey: 'nav.language' },
    { id: 'profile-setup', labelKey: 'nav.profile' },
    { id: 'home', labelKey: 'nav.home' },
    { id: 'screening-intro', labelKey: 'nav.screening' },
    { id: 'learning-dashboard', labelKey: 'nav.learning' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Logo & Tagline */}
        <div
          onClick={() => setScreen('splash')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-transform">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-teal-800">
                Aksh<span className="text-amber-500">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                {t('app.prototypeTag')}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* Center: Interactive Role-Specific Navigation */}
        {userRole === 'child' ? (
          <nav aria-label="Prototype Screens" className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
            {childScreens.map((s, idx) => {
              const isActive = currentScreen === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setScreen(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-teal-800 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                      isActive ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {t(s.labelKey)}
                </button>
              );
            })}

            {(currentScreen.startsWith('screening-') || currentScreen === 'learning-profile') && (
              <div className="ml-1 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-400 text-amber-950 flex items-center gap-1.5 shadow-sm animate-pulse">
                <span>🎯</span>
                <span>Screening Active</span>
              </div>
            )}
          </nav>
        ) : userRole === 'parent' ? (
          <nav aria-label="Parent Views" className="hidden md:flex items-center bg-indigo-50/80 p-1 rounded-2xl border border-indigo-200">
            <button
              onClick={() => setScreen('parent-dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentScreen === 'parent-dashboard'
                  ? 'bg-white text-indigo-950 shadow-sm border border-indigo-200'
                  : 'text-indigo-700 hover:bg-indigo-100/60'
              }`}
            >
              <span>📊</span>
              <span>{t('parent.nav.overview') || 'Parent Overview'}</span>
            </button>
            <button
              onClick={() => setScreen('learning-profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentScreen === 'learning-profile'
                  ? 'bg-white text-indigo-950 shadow-sm border border-indigo-200'
                  : 'text-indigo-700 hover:bg-indigo-100/60'
              }`}
            >
              <span>📑</span>
              <span>{t('parent.nav.learningProfile') || 'Screening Report'}</span>
            </button>
            <button
              onClick={() => setScreen('learning-dashboard')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-100/60 transition-all flex items-center gap-1.5"
            >
              <span>🎮</span>
              <span>{t('parent.nav.childGames') || 'Child Adventure'}</span>
            </button>
          </nav>
        ) : (
          <nav aria-label="Teacher Views" className="hidden md:flex items-center bg-purple-50/80 p-1 rounded-2xl border border-purple-200">
            <button
              onClick={() => setScreen('teacher-dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentScreen === 'teacher-dashboard'
                  ? 'bg-white text-purple-950 shadow-sm border border-purple-200'
                  : 'text-purple-700 hover:bg-purple-100/60'
              }`}
            >
              <span>👩‍🏫</span>
              <span>{t('teacher.nav.roster') || 'Class Roster & Analytics'}</span>
            </button>
            <button
              onClick={() => setScreen('learning-dashboard')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-100/60 transition-all flex items-center gap-1.5"
            >
              <span>🎮</span>
              <span>{t('teacher.nav.previewQuests') || 'Preview Student Quests'}</span>
            </button>
          </nav>
        )}

        {/* Right: Role Switcher & Profile / Language Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Role Switcher Pill */}
          <RoleSwitcher />

          {/* XP & Streak (Visible in child mode) */}
          {userRole === 'child' && (
            <div className="hidden md:flex items-center gap-2">
              <div
                title="Your XP points"
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{gamification.xp} XP</span>
              </div>

              <div
                title="Daily Learning Streak"
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-black shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
                <span>{gamification.streakDays}d</span>
              </div>
            </div>
          )}

          {/* Child Profile Mini Pill */}
          <button
            onClick={() => setScreen('profile-setup')}
            title={t('nav.editProfile')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border-2 border-teal-200 text-teal-900 text-xs font-bold transition-all"
          >
            <span className="text-base">{avatar.emoji}</span>
            <span className="max-w-[70px] sm:max-w-[100px] truncate">{profile.name || 'Explorer'}</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border-2 border-slate-300 text-slate-800 text-xs font-bold shadow-sm transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-teal-900 font-extrabold">{languageConfig.nativeName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border-2 border-slate-200 shadow-xl z-50 p-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    {t('languageSelect.title')}
                  </div>
                  <div className="mt-1 space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-teal-100/70 text-teal-950 font-black'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="text-sm font-semibold">{lang.nativeName}</span>
                        <span className="text-xs text-slate-400 font-normal">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="p-1 border-t border-slate-100 mt-2">
                    <button
                      onClick={() => {
                        setIsLangOpen(false);
                        setScreen('language-select');
                      }}
                      className="w-full py-1.5 text-center text-xs font-bold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg"
                    >
                      {t('nav.changeLanguage')} →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Screen Stepper */}
      <div className="lg:hidden border-t border-slate-200/60 bg-slate-50/80 px-4 py-1.5 flex items-center justify-around text-xs font-bold overflow-x-auto">
        {userRole === 'child' ? (
          childScreens.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setScreen(s.id)}
              className={`px-2 py-1 rounded-lg flex-shrink-0 ${
                currentScreen === s.id ? 'bg-teal-700 text-white' : 'text-slate-600'
              }`}
            >
              {idx + 1}. {t(s.labelKey)}
            </button>
          ))
        ) : userRole === 'parent' ? (
          <div className="flex items-center gap-2 w-full justify-around">
            <button
              onClick={() => setScreen('parent-dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currentScreen === 'parent-dashboard' ? 'bg-indigo-700 text-white' : 'text-indigo-700'
              }`}
            >
              📊 {t('parent.nav.overview') || 'Overview'}
            </button>
            <button
              onClick={() => setScreen('learning-profile')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currentScreen === 'learning-profile' ? 'bg-indigo-700 text-white' : 'text-indigo-700'
              }`}
            >
              📑 {t('parent.nav.learningProfile') || 'Screening'}
            </button>
            <button
              onClick={() => setScreen('learning-dashboard')}
              className="px-3 py-1 rounded-lg text-xs font-bold text-indigo-700"
            >
              🎮 {t('parent.nav.childGames') || 'Games'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full justify-around">
            <button
              onClick={() => setScreen('teacher-dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currentScreen === 'teacher-dashboard' ? 'bg-purple-700 text-white' : 'text-purple-700'
              }`}
            >
              👩‍🏫 {t('teacher.nav.roster') || 'Roster'}
            </button>
            <button
              onClick={() => setScreen('learning-dashboard')}
              className="px-3 py-1 rounded-lg text-xs font-bold text-purple-700"
            >
              🎮 {t('teacher.nav.previewQuests') || 'Preview'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
