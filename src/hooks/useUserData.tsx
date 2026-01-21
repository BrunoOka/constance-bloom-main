import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  rhythm: 'calm' | 'moderate' | 'intense';
  consistency: 'starting' | 'building' | 'established';
  support_level: 'minimal' | 'regular' | 'intensive';
  morning_person: boolean;
  main_goal: 'energy' | 'lightness' | 'balance' | 'confidence' | 'weightloss';
  current_challenge: 'routine' | 'motivation' | 'knowledge' | 'time';
}

interface DailyState {
  id: string;
  user_id: string;
  state_date: string;
  mission_day: number;
  mission_completed: boolean;
  checkin_done: boolean;
  focus_completed: boolean;
  streak: number;
  notes: string | null;
}

export function useUserData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayState, setTodayState] = useState<DailyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Get today's date in Brasilia timezone
  const getTodayBrasilia = () => {
    const now = new Date();
    const brasilia = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    return brasilia.toISOString().split('T')[0];
  };

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile | null;
  }, [user]);

  // Fetch or create today's state
  const fetchOrCreateTodayState = useCallback(async () => {
    if (!user) return null;

    const today = getTodayBrasilia();

    // Try to get today's state
    const { data: existingState, error: fetchError } = await supabase
      .from('daily_states')
      .select('*')
      .eq('user_id', user.id)
      .eq('state_date', today)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching daily state:', fetchError);
      return null;
    }

    if (existingState) {
      return existingState as DailyState;
    }

    // Get yesterday's state to calculate streak and mission day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const { data: yesterdayState } = await supabase
      .from('daily_states')
      .select('*')
      .eq('user_id', user.id)
      .eq('state_date', yesterdayStr)
      .maybeSingle();

    let newMissionDay = 1;
    let newStreak = 0;

    if (yesterdayState) {
      // Continue from yesterday
      newMissionDay = yesterdayState.mission_day >= 30 ? 1 : yesterdayState.mission_day + 1;
      newStreak = yesterdayState.mission_completed ? yesterdayState.streak + 1 : 0;
    }

    // Create today's state
    const { data: newState, error: insertError } = await supabase
      .from('daily_states')
      .insert({
        user_id: user.id,
        state_date: today,
        mission_day: newMissionDay,
        streak: newStreak
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating daily state:', insertError);
      return null;
    }

    return newState as DailyState;
  }, [user]);

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    setProfile((prev) => prev ? { ...prev, ...updates } : null);
  };

  // Complete mission
  const completeMission = async () => {
    if (!user || !todayState) return;

    const { error } = await supabase
      .from('daily_states')
      .update({ mission_completed: true })
      .eq('id', todayState.id);

    if (error) {
      console.error('Error completing mission:', error);
      return;
    }

    // Log the action
    await logAction('mission_complete', { mission_day: todayState.mission_day });

    setTodayState((prev) => prev ? { ...prev, mission_completed: true } : null);
  };

  // Complete focus
  const completeFocus = async () => {
    if (!user || !todayState) return;

    const { error } = await supabase
      .from('daily_states')
      .update({ focus_completed: true })
      .eq('id', todayState.id);

    if (error) {
      console.error('Error completing focus:', error);
      return;
    }

    await logAction('focus_complete', {});

    setTodayState((prev) => prev ? { ...prev, focus_completed: true } : null);
  };

  // Log action
  const logAction = async (actionType: string, context: Record<string, unknown>) => {
    if (!user) return;

    await supabase.from('action_logs').insert([{
      user_id: user.id,
      action_type: actionType,
      context: context as any
    }]);
  };

  // Complete onboarding
  const completeOnboarding = async (profileData: Partial<Profile>) => {
    let currentUser = user;

    if (!currentUser) {
      const { data } = await supabase.auth.getUser();
      currentUser = data.user;
    }

    if (!currentUser) return;

    // We need to call updateProfile logic but with the fresh user
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    // Log action manually since logAction also depends on user state
    await supabase.from('action_logs').insert([{
      user_id: currentUser.id,
      action_type: 'onboarding_complete',
      context: profileData as any
    }]);

    setProfile((prev) => prev ? { ...prev, ...profileData } : null);
    setIsOnboarded(true);
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [profileData, stateData] = await Promise.all([
        fetchProfile(),
        fetchOrCreateTodayState()
      ]);

      setProfile(profileData);
      setTodayState(stateData);

      // Check if onboarding is complete (has name set)
      setIsOnboarded(!!profileData?.name && profileData.name.trim() !== '');

      setLoading(false);
    };

    loadData();
  }, [user, fetchProfile, fetchOrCreateTodayState]);

  return {
    profile,
    todayState,
    loading,
    isOnboarded,
    updateProfile,
    completeMission,
    completeFocus,
    logAction,
    completeOnboarding,
    refetch: async () => {
      const [profileData, stateData] = await Promise.all([
        fetchProfile(),
        fetchOrCreateTodayState()
      ]);
      setProfile(profileData);
      setTodayState(stateData);
    }
  };
}
