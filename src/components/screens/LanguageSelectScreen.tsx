import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, ArrowRight, ArrowLeft, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import type { LanguageCode } from '../../types';
import { Button } from '../common/Button';
import { AudioSpeaker } from '../common/AudioSpeaker';

export const LanguageSelectScreen: React.FC = () => {
  const { currentLanguage, setLanguage, languages, playLanguageAudio, t } = useLanguage();
  const { setScreen, updateProfile } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages by english name, native script name, or region
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return languages;
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q) ||
        lang.script.toLowerCase().includes(q)
    );
  }, [languages, searchQuery]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    updateProfile({ preferredLanguage: code });
    playLanguageAudio(code);
  };

  const handleContinue = () => {
    setScreen('profile-setup');
  };

  const currentLangConfig = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Top Header & Search Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('splash')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('nav.back')}</span>
          </button>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {t('languageSelect.allLanguagesCount', { count: languages.length })}
          </span>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            {t('languageSelect.title')}
          </h2>
          <p className="text-base sm:text-lg font-bold text-teal-700 mb-1">
            {t('languageSelect.titleNative')}
          </p>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {t('languageSelect.subtitle')}
          </p>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="max-w-xl mx-auto mb-6 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('languageSelect.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3.5 rounded-3xl bg-white border-2 border-slate-200/90 text-slate-900 font-bold placeholder:text-slate-400 shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all text-base"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-semibold text-slate-500">
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('languageSelect.listenTip')}</span>
          </div>
        </div>

        {/* 12 Indian Languages Grid */}
        {filteredLanguages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-300 my-6">
            <p className="text-slate-500 font-bold text-base">
              {t('languageSelect.noResults', { query: searchQuery })}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-sm font-bold text-teal-700 hover:underline"
            >
              Show all 12 languages
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 my-4">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`group relative rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left border-2 select-none ${
                    isSelected
                      ? 'bg-teal-50/90 border-teal-500 shadow-md shadow-teal-500/15 -translate-y-1'
                      : 'bg-white border-slate-200/90 hover:border-teal-300 hover:shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top row: Native script title + Audio speaker button */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${
                        isSelected ? 'text-teal-900' : 'text-slate-900 group-hover:text-teal-800'
                      }`}
                    >
                      {lang.nativeName}
                    </span>
                    <AudioSpeaker
                      size="sm"
                      label={`Listen to ${lang.name} greeting`}
                      onPlay={() => playLanguageAudio(lang.code)}
                    />
                  </div>

                  {/* English Name & Script Family */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                    <span className="text-slate-700 font-extrabold">{lang.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                      {lang.script}
                    </span>
                  </div>

                  {/* Sample Greeting / Preview */}
                  <div className="text-xs text-slate-500 font-medium italic truncate mb-2">
                    "{lang.sampleGreeting}"
                  </div>

                  {/* Selection Status Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
                    <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                      {lang.region}
                    </span>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-teal-700 font-black">
                        <CheckCircle2 className="w-4 h-4 fill-teal-600 text-white" />
                        {t('languageSelect.selectedBadge')}
                      </span>
                    ) : (
                      <span className="text-slate-400 group-hover:text-teal-600 font-bold transition-colors">
                        Select →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar with Language Confirmation */}
      <div className="sticky bottom-2 z-20 mt-8 bg-white/95 backdrop-blur-md rounded-3xl p-4 border-2 border-slate-200/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
            {currentLangConfig.nativeName.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('languageSelect.selectedBadge')}
            </div>
            <div className="text-lg font-black text-teal-900">
              {currentLangConfig.nativeName} ({currentLangConfig.name})
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            soundType="click"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={handleContinue}
            className="w-full sm:w-auto min-w-[220px]"
          >
            {t('languageSelect.confirmBtn', { language: currentLangConfig.nativeName })}
          </Button>
        </div>
      </div>
    </div>
  );
};
