import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Sparkles, Sun, Cloud, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface UserProfile {
  name: string;
}

interface RoutineScreenProps {
  user: UserProfile | null;
}

const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const weekData = [
  { day: 'Seg', date: 13, isToday: false, completed: true, focus: 'Hidratação matinal' },
  { day: 'Ter', date: 14, isToday: false, completed: true, focus: 'Café da manhã nutritivo' },
  { day: 'Qua', date: 15, isToday: false, completed: true, focus: 'Caminhada leve' },
  { day: 'Qui', date: 16, isToday: true, completed: false, focus: 'Seu primeiro passo' },
  { day: 'Sex', date: 17, isToday: false, completed: false, focus: 'Preparação do jantar' },
  { day: 'Sáb', date: 18, isToday: false, completed: false, focus: 'Dia de descanso ativo' },
  { day: 'Dom', date: 19, isToday: false, completed: false, focus: 'Reflexão semanal' },
];

const timeSuggestions = [
  {
    id: 'morning',
    time: 'Manhã',
    icon: <Sun size={20} />,
    suggestion: 'Água com limão ao acordar',
    duration: '2 min',
    optional: false,
  },
  {
    id: 'afternoon',
    time: 'Tarde',
    icon: <Cloud size={20} />,
    suggestion: 'Lanche com proteína',
    duration: '10 min',
    optional: true,
  },
  {
    id: 'evening',
    time: 'Noite',
    icon: <Moon size={20} />,
    suggestion: 'Preparar ambiente para dormir',
    duration: '5 min',
    optional: true,
  },
];

export function RoutineScreen({ user }: RoutineScreenProps) {
  const [selectedDay, setSelectedDay] = useState(3); // Thursday

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
            Sua Rotina
          </h1>
          <p className="text-text-secondary">
            Sugestões adaptadas ao seu ritmo
          </p>
        </motion.div>
      </header>

      {/* Week Selector */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-natural"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft size={20} className="text-text-muted" />
            </button>
            <span className="font-semibold text-text-primary">Janeiro 2026</span>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight size={20} className="text-text-muted" />
            </button>
          </div>

          {/* Days */}
          <div className="flex justify-between">
            {weekData.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-2 px-2 rounded-xl transition-all duration-300",
                  selectedDay === index
                    ? "bg-primary"
                    : day.isToday
                    ? "bg-accent"
                    : "hover:bg-muted"
                )}
              >
                <span className={cn(
                  "text-xs font-medium",
                  selectedDay === index
                    ? "text-primary-foreground"
                    : "text-text-muted"
                )}>
                  {day.day}
                </span>
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  selectedDay === index
                    ? "text-primary-foreground"
                    : day.isToday
                    ? "text-primary"
                    : "text-text-primary"
                )}>
                  {day.date}
                </span>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  day.completed
                    ? "bg-primary"
                    : selectedDay === index
                    ? "bg-primary-foreground/30"
                    : "bg-transparent"
                )} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Selected Day Focus */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "rounded-2xl p-5",
            weekData[selectedDay].completed
              ? "bg-accent border border-primary/20"
              : "bg-card shadow-natural"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              weekData[selectedDay].completed
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-text-muted"
            )}>
              {weekData[selectedDay].completed ? (
                <CheckCircle size={20} />
              ) : (
                <Circle size={20} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-1">
                {weekData[selectedDay].isToday ? 'Foco de hoje' : `Foco de ${weekData[selectedDay].day.toLowerCase()}`}
              </p>
              <p className={cn(
                "font-semibold",
                weekData[selectedDay].completed ? "text-primary" : "text-text-primary"
              )}>
                {weekData[selectedDay].focus}
              </p>
              {weekData[selectedDay].completed && (
                <p className="text-sm text-primary mt-1">Concluído ✓</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Time-based Suggestions */}
      <div className="px-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-primary" />
          <h3 className="text-sm font-medium text-text-secondary">
            Sugestões para {weekData[selectedDay].isToday ? 'hoje' : weekData[selectedDay].day.toLowerCase()}
          </h3>
        </div>

        <div className="space-y-3">
          {timeSuggestions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-card rounded-2xl p-4 shadow-natural"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text-primary">{item.suggestion}</p>
                    {item.optional && (
                      <span className="px-2 py-0.5 bg-muted text-text-muted text-xs rounded-full">
                        opcional
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted mt-0.5">
                    {item.time} • {item.duration}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flexibility Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-accent/30 rounded-xl"
        >
          <p className="text-sm text-text-secondary text-center leading-relaxed">
            💡 Essas são apenas sugestões. Adapte ao que funciona pra você.
            <br />
            <span className="text-primary font-medium">Feito é melhor que perfeito.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
