import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Sparkles, Flame, Clock, ChevronRight, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  name: string;
  streak: number;
  currentDay: number;
}

interface TodayScreenProps {
  user: UserProfile | null;
  focusCompleted: boolean;
  onCompleteFocus: () => void;
}

const todayFocus = {
  title: 'Seu primeiro passo',
  description: 'Beba um copo de água morna ao acordar. Simples assim.',
  duration: '2 min'
};

export function TodayScreen({ user, focusCompleted, onCompleteFocus }: TodayScreenProps) {
  if (!user) return null;

  const greeting = getGreeting();
  const motivationalMessage = getMotivationalMessage(user.streak, focusCompleted);

  return (
    <div className="min-h-screen bg-gradient-soft pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <p className="text-text-secondary">{greeting}</p>
          <h1 className="text-2xl font-bold text-text-primary">
            {user.name} 💚
          </h1>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-5 shadow-natural"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <Flame className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Sua constância</p>
                <p className="text-xl font-bold text-text-primary">
                  {user.streak} {user.streak === 1 ? 'dia' : 'dias'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Dia</p>
              <p className="text-2xl font-bold text-primary">{user.currentDay}</p>
            </div>
          </div>
        </motion.div>

        {/* Today's Focus - MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "rounded-3xl p-6 shadow-natural-lg transition-all duration-500",
            focusCompleted
              ? "bg-accent border-2 border-primary/30"
              : "bg-card"
          )}
        >
          <div className="space-y-4">
            {/* Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" size={18} />
                <span className="text-sm font-medium text-primary">
                  Seu foco de hoje
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-text-muted text-sm">
                <Clock size={14} />
                <span>{todayFocus.duration}</span>
              </div>
            </div>

            {/* Focus Content */}
            <div className="space-y-2">
              <h2 className={cn(
                "text-xl font-bold transition-colors",
                focusCompleted ? "text-primary" : "text-text-primary"
              )}>
                {todayFocus.title}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {todayFocus.description}
              </p>
            </div>

            {/* Action Button */}
            {!focusCompleted ? (
              <Button
                onClick={onCompleteFocus}
                className="w-full mt-4 gap-2"
                size="lg"
              >
                <Circle size={20} />
                Concluir foco do dia
              </Button>
            ) : (
              <div className="mt-4 flex items-center justify-center gap-2 py-3 text-primary font-semibold">
                <CheckCircle2 size={22} />
                <span>Concluído! Você é incrível 🎉</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-accent/50 rounded-2xl p-4"
        >
          <p className="text-text-secondary text-center text-sm leading-relaxed">
            {motivationalMessage}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-text-muted px-1">
            Acesso rápido
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              icon={<Leaf size={20} />}
              title="Pilar atual"
              subtitle="Alimentação consciente"
            />
            <QuickActionCard
              icon={<Sparkles size={20} />}
              title="Próxima lição"
              subtitle="2 min de leitura"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function QuickActionCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button className="bg-card rounded-2xl p-4 text-left shadow-natural hover:shadow-glow transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-accent text-primary">
          {icon}
        </div>
        <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-colors" />
      </div>
      <div className="mt-3">
        <p className="font-semibold text-text-primary text-sm">{title}</p>
        <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
      </div>
    </button>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia,';
  if (hour < 18) return 'Boa tarde,';
  return 'Boa noite,';
}

function getMotivationalMessage(streak: number, completed: boolean) {
  if (completed) {
    return '"Você fez o que precisava ser feito hoje. Isso é tudo que importa."';
  }
  if (streak === 0) {
    return '"A jornada começa com um único passo. Hoje é o seu primeiro."';
  }
  if (streak < 7) {
    return '"Constância se constrói um dia de cada vez. Continue."';
  }
  return '"Você está criando um novo padrão. Seu corpo agradece."';
}
