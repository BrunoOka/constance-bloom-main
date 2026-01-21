export interface UserProfile {
  id: string;
  name: string;
  
  // Perfil comportamental
  rhythm: 'calm' | 'moderate' | 'intense';
  consistency: 'starting' | 'building' | 'established';
  supportLevel: 'minimal' | 'regular' | 'intensive';
  
  // Preferências
  morningPerson: boolean;
  mainGoal: 'energy' | 'lightness' | 'balance' | 'confidence' | 'weightloss';
  currentChallenge: 'routine' | 'motivation' | 'knowledge' | 'time';
  
  // Progresso
  currentDay: number;
  currentPillar: number;
  streak: number;
  
  // Estado
  lastCheckIn?: Date;
  todayFocus?: string;
  todayCompleted: boolean;
}

export interface DailyFocus {
  id: string;
  title: string;
  description: string;
  pillarId: number;
  type: 'action' | 'reflection' | 'habit';
  duration: string;
  completed: boolean;
}

export interface Pillar {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'read' | 'action';
}

export interface CheckIn {
  date: Date;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: 'great' | 'good' | 'neutral' | 'low';
  focusCompleted: boolean;
  note?: string;
}

export interface WeekDay {
  date: Date;
  dayName: string;
  focus?: DailyFocus;
  suggestion?: string;
  completed: boolean;
  isToday: boolean;
}
