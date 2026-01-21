-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  rhythm TEXT CHECK (rhythm IN ('calm', 'moderate', 'intense')) DEFAULT 'moderate',
  consistency TEXT CHECK (consistency IN ('starting', 'building', 'established')) DEFAULT 'starting',
  support_level TEXT CHECK (support_level IN ('minimal', 'regular', 'intensive')) DEFAULT 'regular',
  morning_person BOOLEAN DEFAULT true,
  main_goal TEXT CHECK (main_goal IN ('energy', 'lightness', 'balance', 'confidence', 'weightloss')) DEFAULT 'balance',
  current_challenge TEXT CHECK (current_challenge IN ('routine', 'motivation', 'knowledge', 'time')) DEFAULT 'routine',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_states table (estado diário do usuário)
CREATE TABLE public.daily_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state_date DATE NOT NULL DEFAULT (CURRENT_DATE AT TIME ZONE 'America/Sao_Paulo'),
  mission_day INTEGER NOT NULL DEFAULT 1 CHECK (mission_day >= 1 AND mission_day <= 30),
  mission_completed BOOLEAN NOT NULL DEFAULT false,
  checkin_done BOOLEAN NOT NULL DEFAULT false,
  focus_completed BOOLEAN NOT NULL DEFAULT false,
  streak INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, state_date)
);

-- Create action_logs table (histórico de ações)
CREATE TABLE public.action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_date DATE NOT NULL DEFAULT (CURRENT_DATE AT TIME ZONE 'America/Sao_Paulo'),
  action_time TIME NOT NULL DEFAULT (CURRENT_TIME AT TIME ZONE 'America/Sao_Paulo'),
  action_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  action_type TEXT NOT NULL CHECK (action_type IN ('mission_complete', 'checkin', 'chat', 'navigation', 'focus_complete', 'onboarding_complete')),
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for daily_states
CREATE POLICY "Users can view own daily states" ON public.daily_states
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily states" ON public.daily_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily states" ON public.daily_states
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for action_logs
CREATE POLICY "Users can view own action logs" ON public.action_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own action logs" ON public.action_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_daily_states_user_date ON public.daily_states(user_id, state_date);
CREATE INDEX idx_action_logs_user_date ON public.action_logs(user_id, action_date);
CREATE INDEX idx_action_logs_timestamp ON public.action_logs(action_timestamp DESC);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_states_updated_at
  BEFORE UPDATE ON public.daily_states
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();