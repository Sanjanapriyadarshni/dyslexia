import React, { createContext, useContext, useEffect, useState } from 'react';
import { AVATARS, DEFAULT_GAMIFICATION, DEFAULT_PROFILE, SCREENING_INDICATORS } from '../data/mockData';
import type { Avatar, ChildProfile, GamificationState, ScreenType, ScreeningIndicator, ScreeningScores, GameId } from '../types';
import { soundEngine } from '../hooks/useSound';
import { calculateLevel, evaluateBadges, simulateSkillProgress } from '../services/gamificationService';

export interface GameCompletionResult {
  newlyUnlockedBadgeId?: string | null;
  skillGrowth: {
    skillName: string;
    previousScore: number;
    newScore: number;
  };
}

interface ProfileContextType {
  profile: ChildProfile;
  avatar: Avatar;
  gamification: GamificationState;
  currentScreen: ScreenType;
  screeningIndicators: ScreeningIndicator[];
  setScreen: (screen: ScreenType) => void;
  updateProfile: (updated: Partial<ChildProfile>) => void;
  addXP: (amount: number) => void;
  addStars: (amount: number) => void;
  completeGame: (gameId: GameId, xpReward: number, starsReward: number) => GameCompletionResult;
  applyScreeningScores: (scores: ScreeningScores) => void;
  avatars: Avatar[];
  resetDemoData: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'akshai_profile_data';
const GAMIFICATION_STORAGE_KEY = 'akshai_gamification_data';
const INDICATORS_STORAGE_KEY = 'akshai_indicators_data';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState<ScreenType>('splash');

  const [profile, setProfileState] = useState<ChildProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_GAMIFICATION;
  });

  const [screeningIndicators, setScreeningIndicators] = useState<ScreeningIndicator[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(INDICATORS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return SCREENING_INDICATORS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(gamification));
    }
  }, [gamification]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(INDICATORS_STORAGE_KEY, JSON.stringify(screeningIndicators));
    }
  }, [screeningIndicators]);

  const activeAvatar = AVATARS.find((a) => a.id === profile.avatarId) || AVATARS[0];

  const setScreen = (screen: ScreenType) => {
    soundEngine.playClick();
    setCurrentScreenState(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = (updated: Partial<ChildProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updated }));
  };

  const addXP = (amount: number) => {
    soundEngine.playSuccess();
    setGamification((prev) => {
      const newXP = prev.xp + amount;
      const levelInfo = calculateLevel(newXP);
      return {
        ...prev,
        xp: newXP,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        completedQuests: prev.completedQuests + 1,
      };
    });
  };

  const addStars = (amount: number) => {
    soundEngine.playSuccess();
    setGamification((prev) => ({
      ...prev,
      stars: (prev.stars || 0) + amount,
    }));
  };

  const completeGame = (
    gameId: GameId,
    xpReward: number,
    starsReward: number
  ): GameCompletionResult => {
    soundEngine.playSuccess();

    // 1. Skill progress simulation
    const { updatedIndicators, skillChanged, previousScore, newScore } = simulateSkillProgress(
      gameId,
      screeningIndicators
    );
    setScreeningIndicators(updatedIndicators);

    let newlyUnlocked: string | null = null;

    // 2. Gamification state update
    setGamification((prev) => {
      const newXP = prev.xp + xpReward;
      const newStars = (prev.stars || 0) + starsReward;
      const levelInfo = calculateLevel(newXP);
      const completedGames = prev.completedGameIds.includes(gameId)
        ? prev.completedGameIds
        : [...prev.completedGameIds, gameId];

      const evaluatedBadges = evaluateBadges({
        completedGameIds: completedGames,
        streakDays: prev.streakDays,
        xp: newXP,
        totalGamesCount: prev.completedQuests + 1,
      });

      const freshUnlock = evaluatedBadges.find((bId) => !prev.unlockedBadgeIds.includes(bId));
      if (freshUnlock) {
        newlyUnlocked = freshUnlock;
      }

      return {
        ...prev,
        xp: newXP,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        stars: newStars,
        completedQuests: prev.completedQuests + 1,
        completedGameIds: completedGames,
        unlockedBadgeIds: evaluatedBadges,
      };
    });

    return {
      newlyUnlockedBadgeId: newlyUnlocked,
      skillGrowth: {
        skillName: skillChanged,
        previousScore,
        newScore,
      },
    };
  };

  const applyScreeningScores = (scores: ScreeningScores) => {
    soundEngine.playCheer();
    // Map evaluated scores to our 4 dashboard indicators
    const updatedIndicators: ScreeningIndicator[] = [
      {
        skill: 'Phonemic Awareness',
        score: scores.readingAccuracy,
        target: 85,
        fullMark: 100,
        status: scores.readingAccuracy >= 80 ? 'strong' : scores.readingAccuracy >= 65 ? 'developing' : 'support_recommended',
      },
      {
        skill: 'Letter Recognition',
        score: scores.letterRecognition,
        target: 80,
        fullMark: 100,
        status: scores.letterRecognition >= 80 ? 'strong' : scores.letterRecognition >= 65 ? 'developing' : 'support_recommended',
      },
      {
        skill: 'Visual Tracking',
        score: scores.comprehension,
        target: 75,
        fullMark: 100,
        status: scores.comprehension >= 80 ? 'strong' : scores.comprehension >= 65 ? 'developing' : 'support_recommended',
      },
      {
        skill: 'Sound Blending',
        score: scores.spelling,
        target: 70,
        fullMark: 100,
        status: scores.spelling >= 80 ? 'strong' : scores.spelling >= 65 ? 'developing' : 'support_recommended',
      },
    ];

    setScreeningIndicators(updatedIndicators);
    addXP(100);
  };

  const resetDemoData = () => {
    setProfileState(DEFAULT_PROFILE);
    setGamification(DEFAULT_GAMIFICATION);
    setScreeningIndicators(SCREENING_INDICATORS);
    soundEngine.playPop();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        avatar: activeAvatar,
        gamification,
        currentScreen,
        screeningIndicators,
        setScreen,
        updateProfile,
        addXP,
        addStars,
        completeGame,
        applyScreeningScores,
        avatars: AVATARS,
        resetDemoData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
