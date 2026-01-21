import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { UserProfile, DailyFocus, CheckIn } from '@/types/user';
import { useUserData } from '@/hooks/useUserData';

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void; // Kept for compatibility, but should ideally use updateProfile
  todayFocus: DailyFocus | null;
  setTodayFocus: (focus: DailyFocus) => void;
  completeFocus: () => void;
  addCheckIn: (checkIn: CheckIn) => void;
  isOnboarded: boolean;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  // Weight loss mission system
  missionDay: number;
  missionCompletedToday: boolean;
  completeMission: () => void;
  resetMissionCycle: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const {
    profile,
    todayState,
    loading,
    isOnboarded,
    updateProfile,
    completeMission: completeMissionDB,
    completeFocus: completeFocusDB,
    completeOnboarding: completeOnboardingDB,
    logAction
  } = useUserData();

  // Map Supabase profile to UserProfile
  const user: UserProfile | null = useMemo(() => {
    if (!profile) return null;
    return {
      id: profile.id,
      name: profile.name,
      rhythm: profile.rhythm,
      consistency: profile.consistency,
      supportLevel: profile.support_level,
      morningPerson: profile.morning_person,
      mainGoal: profile.main_goal,
      currentChallenge: profile.current_challenge,
      // Derived/Default values
      currentDay: todayState?.mission_day || 1,
      currentPillar: 1, // TODO: Implement pillar logic in DB
      streak: todayState?.streak || 0,
      todayCompleted: todayState?.focus_completed || false,
      lastCheckIn: todayState?.checkin_done ? new Date(todayState.state_date) : undefined,
    };
  }, [profile, todayState]);

  // Mock todayFocus for now, or fetch from DB if we add a table for it
  // For now we just track completion state in daily_states
  const todayFocus: DailyFocus | null = useMemo(() => {
    if (!user) return null;
    return {
      id: 'daily-focus-1',
      title: 'Planejamento Alimentar',
      description: 'Organize suas refeições do dia',
      pillarId: 1,
      type: 'action',
      duration: '10 min',
      completed: todayState?.focus_completed || false
    };
  }, [user, todayState]);

  const setUser = (updatedUser: UserProfile) => {
    // Reverse map to update profile
    updateProfile({
      name: updatedUser.name,
      rhythm: updatedUser.rhythm,
      consistency: updatedUser.consistency,
      support_level: updatedUser.supportLevel,
      morning_person: updatedUser.morningPerson,
      main_goal: updatedUser.mainGoal,
      current_challenge: updatedUser.currentChallenge,
    });
  };

  const setTodayFocus = (focus: DailyFocus) => {
    // No-op for now as focus is static/generated
    console.log('setTodayFocus called', focus);
  };

  const completeFocus = () => {
    completeFocusDB();
  };

  const addCheckIn = (checkIn: CheckIn) => {
    // In the future we can save the full checkin data to a new table or jsonb
    // For now we just mark checkin_done in daily_states
    logAction('checkin', checkIn as unknown as Record<string, unknown>);
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    // Map UserProfile partial to DB profile partial
    const dbProfileUpdates: any = {};
    if (data.name) dbProfileUpdates.name = data.name;
    if (data.rhythm) dbProfileUpdates.rhythm = data.rhythm;
    if (data.consistency) dbProfileUpdates.consistency = data.consistency;
    if (data.supportLevel) dbProfileUpdates.support_level = data.supportLevel;
    if (data.morningPerson !== undefined) dbProfileUpdates.morning_person = data.morningPerson;
    if (data.mainGoal) dbProfileUpdates.main_goal = data.mainGoal;
    if (data.currentChallenge) dbProfileUpdates.current_challenge = data.currentChallenge;

    completeOnboardingDB(dbProfileUpdates);
  };

  const completeMission = () => {
    completeMissionDB();
  };

  const resetMissionCycle = () => {
    // This logic is now handled by the backend/DB state (mission_day loops 1-30)
    console.log('resetMissionCycle called - handled by DB logic');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        todayFocus,
        setTodayFocus,
        completeFocus,
        addCheckIn,
        isOnboarded,
        completeOnboarding,
        missionDay: todayState?.mission_day || 1,
        missionCompletedToday: todayState?.mission_completed || false,
        completeMission,
        resetMissionCycle,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
