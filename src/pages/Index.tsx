import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingFlow, OnboardingData } from '@/components/onboarding/OnboardingFlow';
import { BottomNav } from '@/components/layout/BottomNav';
import { TodayScreen } from '@/components/screens/TodayScreen';
import { MethodScreen } from '@/components/screens/MethodScreen';
import { RoutineScreen } from '@/components/screens/RoutineScreen';
import { ProgressScreen } from '@/components/screens/ProgressScreen';
import { HelpScreen } from '@/components/screens/HelpScreen';
import { WeightLossScreen } from '@/components/screens/WeightLossScreen';
import { toast } from 'sonner';

function AppContent() {
  const {
    isOnboarded,
    completeOnboarding,
    user,
    todayFocus,
    completeFocus,
    missionDay,
    missionCompletedToday,
    completeMission,
  } = useUser();
  const { signUp, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState('today');

  const handleOnboardingComplete = async (data: OnboardingData, credentials?: { email: string; password: string; mode: 'signup' | 'login' }) => {
    if (credentials) {
      try {
        let error;
        if (credentials.mode === 'login') {
          const { error: signInError } = await signIn(credentials.email, credentials.password);
          error = signInError;
        } else {
          const { error: signUpError } = await signUp(credentials.email, credentials.password, data.name);
          error = signUpError;
        }

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado. Tente fazer login.');
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos.');
          } else {
            toast.error(`Erro ao ${credentials.mode === 'login' ? 'entrar' : 'criar conta'}: ` + error.message);
          }
          return;
        }

        // We pass the data to completeOnboarding which saves to DB
        // Note: completeOnboarding in UserContext uses the current user. 
        // We rely on useAuth updating the user state after signup/login.

        // If logging in, we preserve the existing name in the DB (don't overwrite it)
        const dataToSave = { ...data };
        if (credentials.mode === 'login') {
          delete (dataToSave as any).name;
        }

        completeOnboarding(dataToSave as any);
        toast.success(credentials.mode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!');
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Erro inesperado na autenticação.');
      }
    } else {
      // Fallback for dev or if logic changes
      completeOnboarding(data as any);
    }
  };

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {activeTab === 'today' && (
        <TodayScreen
          user={user}
          focusCompleted={todayFocus?.completed || false}
          onCompleteFocus={completeFocus}
        />
      )}
      {activeTab === 'weightloss' && (
        <WeightLossScreen
          missionDay={missionDay}
          missionCompleted={missionCompletedToday}
          onCompleteMission={completeMission}
        />
      )}
      {activeTab === 'method' && <MethodScreen />}
      {activeTab === 'routine' && <RoutineScreen user={user} />}
      {activeTab === 'progress' && <ProgressScreen user={user} streak={user?.streak || 0} />}
      {activeTab === 'help' && <HelpScreen user={user} />}

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showWeightLoss={user?.mainGoal === 'weightloss'}
      />
    </div>
  );
}

const Index = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-background shadow-xl">
      <AppContent />
    </div>
  );
};

export default Index;
