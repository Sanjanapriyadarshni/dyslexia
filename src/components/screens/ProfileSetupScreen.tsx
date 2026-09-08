import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Mascot } from '../common/Mascot';

export const ProfileSetupScreen: React.FC = () => {
  const { currentLanguage, languages, t } = useLanguage();
  const { profile, updateProfile, avatars, setScreen } = useProfile();

  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState<number>(profile.age || 8);
  const [grade, setGrade] = useState<string>(profile.grade || 'Class 3');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(profile.avatarId || 'akshu');
  const [errorMessage, setErrorMessage] = useState('');

  const ageOptions = [6, 7, 8, 9, 10, 11, 12];
  const gradeOptions = [
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
  ];

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(t('profile.errors.nameRequired'));
      return;
    }

    setErrorMessage('');
    updateProfile({
      name: name.trim(),
      age,
      grade,
      avatarId: selectedAvatarId,
      preferredLanguage: currentLanguage,
      isConfigured: true,
    });

    // Navigate to Child Home Dashboard!
    setScreen('home');
  };

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setScreen('language-select')}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.back')}</span>
        </button>
        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Step 3 of 4: Child Profile
        </span>
      </div>

      {/* Mascot Speech Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Mascot
          size="lg"
          expression="happy"
          speechText={t('profile.mascotPrompt')}
          className="mb-2"
        />
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">
          {t('profile.title')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg">
          {t('profile.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Step A: Child's Name Input */}
        <Card variant="white">
          <label className="block text-base sm:text-lg font-black text-slate-800 mb-2">
            1. {t('profile.nameLabel')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder={t('profile.namePlaceholder')}
            maxLength={30}
            className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 text-slate-900 font-bold text-lg focus:bg-white transition-all outline-none ${
              errorMessage
                ? 'border-rose-400 ring-4 ring-rose-100'
                : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
            }`}
          />
          {errorMessage && (
            <p className="mt-2 text-sm font-bold text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </p>
          )}
        </Card>

        {/* Step B: Avatar Selection (6 Cute Companions) */}
        <Card variant="white">
          <label className="block text-base sm:text-lg font-black text-slate-800 mb-3">
            2. {t('profile.avatarLabel')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {avatars.map((av) => {
              const isSelected = selectedAvatarId === av.id;
              // Localized avatar role or default
              const roleTranslated = t(`avatars.${av.id}.role`) || av.role;
              const nameTranslated = t(`avatars.${av.id}.name`) || av.name;

              return (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatarId(av.id)}
                  className={`relative p-3 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all duration-150 select-none ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-500 shadow-md shadow-amber-400/20 scale-105 ring-2 ring-amber-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-4xl sm:text-5xl mb-1 filter drop-shadow-sm">
                    {av.emoji}
                  </div>
                  <div className="text-xs font-black text-slate-800 line-clamp-1">
                    {nameTranslated}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5 line-clamp-1">
                    {roleTranslated}
                  </div>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-xs shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs font-semibold text-amber-950">
            <span className="text-xl">{selectedAvatar.emoji}</span>
            <span>
              <strong>{t(`avatars.${selectedAvatar.id}.name`) || selectedAvatar.name}</strong>:{' '}
              {selectedAvatar.description}
            </span>
          </div>
        </Card>

        {/* Step C: Age Selection (6 to 12) */}
        <Card variant="white">
          <label className="block text-base sm:text-lg font-black text-slate-800 mb-2">
            3. {t('profile.ageLabel')}
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {ageOptions.map((num) => {
              const isSelected = age === num;
              return (
                <button
                  type="button"
                  key={num}
                  onClick={() => setAge(num)}
                  className={`py-3 rounded-2xl font-black text-lg sm:text-xl transition-all border-2 select-none ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {num}
                  <span className="block text-[10px] font-bold opacity-80">
                    {t('profile.ageUnit')}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step D: Grade/Class Selection */}
        <Card variant="white">
          <label className="block text-base sm:text-lg font-black text-slate-800 mb-2">
            4. {t('profile.gradeLabel')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {gradeOptions.map((g) => {
              const isSelected = grade === g;
              return (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2.5 px-3 rounded-2xl font-bold text-sm transition-all border-2 select-none ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step E: Preferred Learning Language Preview & Switch */}
        <Card variant="pastel-teal" className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                {t('profile.preferredLanguageLabel')}
              </div>
              <div className="text-lg font-black text-teal-950">
                {languages.find((l) => l.code === currentLanguage)?.nativeName} (
                {languages.find((l) => l.code === currentLanguage)?.name})
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setScreen('language-select')}
          >
            {t('nav.changeLanguage')}
          </Button>
        </Card>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="xl"
            fullWidth
            soundType="success"
            rightIcon={<ArrowRight className="w-6 h-6" />}
          >
            {t('profile.submitBtn')}
          </Button>
        </div>
      </form>
    </div>
  );
};
