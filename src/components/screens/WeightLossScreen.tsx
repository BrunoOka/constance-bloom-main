import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Leaf, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { missions, getRandomCompletionMessage, cycleCompleteMessage } from '@/data/missions';
import { cn } from '@/lib/utils';

interface WeightLossScreenProps {
  missionDay: number;
  missionCompleted: boolean;
  onCompleteMission: () => void;
}

export function WeightLossScreen({ missionDay, missionCompleted, onCompleteMission }: WeightLossScreenProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCycleComplete, setIsCycleComplete] = useState(false);

  const currentDay = missionDay || 1;
  const currentMission = missions[currentDay - 1];
  const progress = (currentDay / 30) * 100;

  const handleCompleteMission = () => {
    if (currentDay === 30) {
      setFeedbackMessage(cycleCompleteMessage);
      setIsCycleComplete(true);
    } else {
      setFeedbackMessage(getRandomCompletionMessage());
      setIsCycleComplete(false);
    }
    setShowFeedback(true);
    onCompleteMission();
  };

  const closeFeedback = () => {
    setShowFeedback(false);
    setIsCycleComplete(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-b from-primary/10 to-background px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Target className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Emagrecimento</h1>
            <p className="text-text-secondary text-sm">
              Sem dietas restritivas. Um dia de cada vez.
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Dia {currentDay} de 30
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-6 py-6">
        {/* Central message */}
        <div className="bg-accent/50 rounded-2xl p-4 mb-8 border border-primary/10">
          <p className="text-center text-text-secondary text-sm italic">
            "Emagrecer é repetir pequenos hábitos todos os dias."
          </p>
        </div>

        {/* Today's mission */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            Missão de Hoje
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-card rounded-2xl p-6 border-2 shadow-natural",
              missionCompleted ? "border-primary/50 bg-accent/30" : "border-primary/20"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-xl shrink-0",
                missionCompleted ? "bg-primary" : "bg-primary/10"
              )}>
                {missionCompleted ? (
                  <Check className="text-primary-foreground" size={28} />
                ) : (
                  <Leaf className="text-primary" size={28} />
                )}
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  Dia {currentDay}
                </span>
                <h3 className={cn(
                  "text-xl font-bold mt-1 mb-2",
                  missionCompleted ? "text-primary" : "text-text-primary"
                )}>
                  {currentMission.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {currentMission.description}
                </p>
              </div>
            </div>

            {!missionCompleted && (
              <Button
                onClick={handleCompleteMission}
                className="w-full mt-6 gap-2"
                size="lg"
              >
                <Check size={20} />
                Concluir missão do dia
              </Button>
            )}

            {missionCompleted && (
              <div className="mt-6 flex items-center justify-center gap-2 py-3 text-primary font-semibold">
                <Check size={22} />
                <span>Missão concluída! 🎉</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Week overview */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            Próximos dias
          </h3>
          <div className="space-y-2">
            {missions.slice(currentDay, currentDay + 3).map((mission, index) => (
              <div
                key={mission.day}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border",
                  index === 0 && "opacity-80",
                  index === 1 && "opacity-60",
                  index === 2 && "opacity-40"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-text-muted">
                    {mission.day}
                  </span>
                </div>
                <span className="text-sm text-text-secondary truncate">
                  {mission.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-muted">
            Não é sobre perfeição. É sobre constância.
          </p>
        </div>
      </main>

      {/* Feedback modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6"
            onClick={closeFeedback}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn(
                "w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center",
                isCycleComplete ? "bg-primary" : "bg-primary/10"
              )}>
                {isCycleComplete ? (
                  <Sparkles className="text-primary-foreground" size={32} />
                ) : (
                  <Check className="text-primary" size={32} />
                )}
              </div>
              
              <p className="text-lg text-text-primary font-medium leading-relaxed">
                {feedbackMessage}
              </p>

              <Button
                onClick={closeFeedback}
                variant="outline"
                className="mt-6"
              >
                Continuar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
