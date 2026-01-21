import { motion } from 'framer-motion';
import { Flame, TrendingUp, Award, Calendar, Sparkles, Heart, Zap, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  name: string;
  currentDay: number;
}

interface ProgressScreenProps {
  user: UserProfile | null;
  streak: number;
}

const milestones = [
  { id: 1, title: 'Primeiro passo', description: 'Você começou!', icon: <Zap size={20} />, achieved: true },
  { id: 2, title: '7 dias seguidos', description: 'Uma semana de constância', icon: <Flame size={20} />, achieved: false },
  { id: 3, title: 'Pilar completo', description: 'Terminou seu primeiro pilar', icon: <Leaf size={20} />, achieved: false },
  { id: 4, title: '30 dias', description: 'Um mês de transformação', icon: <Award size={20} />, achieved: false },
];

const weekHistory = [
  { day: 'Seg', completed: true },
  { day: 'Ter', completed: true },
  { day: 'Qua', completed: true },
  { day: 'Qui', completed: false },
  { day: 'Sex', completed: false },
  { day: 'Sáb', completed: false },
  { day: 'Dom', completed: false },
];

export function ProgressScreen({ user, streak }: ProgressScreenProps) {
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-soft pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold text-text-primary">
            Seu Progresso
          </h1>
          <p className="text-text-secondary">
            Celebre cada pequena vitória
          </p>
        </motion.div>
      </header>

      <main className="px-6 space-y-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <StatCard
            icon={<Flame className="text-primary" size={24} />}
            value={streak}
            label="dias seguidos"
            highlight
          />
          <StatCard
            icon={<Calendar className="text-primary" size={24} />}
            value={user.currentDay}
            label="dia atual"
          />
          <StatCard
            icon={<TrendingUp className="text-primary" size={24} />}
            value="12%"
            label="método completo"
          />
          <StatCard
            icon={<Heart className="text-primary" size={24} />}
            value="3"
            label="check-ins feitos"
          />
        </motion.div>

        {/* Week View */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 shadow-natural"
        >
          <h3 className="font-semibold text-text-primary mb-4">Esta semana</h3>
          <div className="flex justify-between">
            {weekHistory.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  day.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-text-muted"
                )}>
                  {day.completed ? (
                    <Sparkles size={16} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-current opacity-30" />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  day.completed ? "text-primary" : "text-text-muted"
                )}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-text-primary px-1">Conquistas</h3>
          
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={cn(
                  "rounded-2xl p-4 transition-all duration-300",
                  milestone.achieved
                    ? "bg-accent border border-primary/20"
                    : "bg-card shadow-natural opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    milestone.achieved
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-text-muted"
                  )}>
                    {milestone.icon}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-semibold",
                      milestone.achieved ? "text-primary" : "text-text-muted"
                    )}>
                      {milestone.title}
                    </p>
                    <p className="text-sm text-text-muted mt-0.5">
                      {milestone.description}
                    </p>
                  </div>
                  {milestone.achieved && (
                    <span className="text-lg">✨</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-primary/5 rounded-2xl p-5 border border-primary/10"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">💚</div>
            <div>
              <p className="font-semibold text-text-primary mb-1">
                Progresso não é linear
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Alguns dias serão mais fáceis, outros nem tanto. O que importa é continuar, 
                um passo de cada vez. Você está fazendo o seu melhor.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ icon, value, label, highlight }: { icon: React.ReactNode; value: string | number; label: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl p-4 transition-all duration-300",
      highlight
        ? "bg-primary text-primary-foreground shadow-glow"
        : "bg-card shadow-natural"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
        highlight ? "bg-primary-foreground/20" : "bg-accent"
      )}>
        {icon}
      </div>
      <p className={cn(
        "text-2xl font-bold",
        highlight ? "text-primary-foreground" : "text-text-primary"
      )}>
        {value}
      </p>
      <p className={cn(
        "text-sm mt-0.5",
        highlight ? "text-primary-foreground/80" : "text-text-muted"
      )}>
        {label}
      </p>
    </div>
  );
}
