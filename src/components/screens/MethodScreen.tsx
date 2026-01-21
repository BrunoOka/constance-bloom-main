import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { Leaf, Droplets, Moon, Apple, Heart, Lock, CheckCircle, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Pillar } from '@/types/user';

const pillars: Pillar[] = [
  {
    id: 1,
    title: 'Hidratação Inteligente',
    subtitle: 'A base de tudo',
    description: 'Como a água transforma seu metabolismo de dentro pra fora.',
    icon: 'droplets',
    unlocked: true,
    progress: 30,
    lessons: [
      { id: '1-1', title: 'Por que hidratação importa', duration: '3 min', completed: true, type: 'read' },
      { id: '1-2', title: 'Seu ritual da manhã', duration: '2 min', completed: false, type: 'action' },
      { id: '1-3', title: 'Sinais do corpo', duration: '4 min', completed: false, type: 'read' },
    ],
  },
  {
    id: 2,
    title: 'Alimentação Consciente',
    subtitle: 'Sem dieta, com clareza',
    description: 'Entenda o que comer e quando, sem neuras.',
    icon: 'apple',
    unlocked: true,
    progress: 0,
    lessons: [
      { id: '2-1', title: 'Os 4 grupos essenciais', duration: '5 min', completed: false, type: 'read' },
      { id: '2-2', title: 'Montando seu prato', duration: '3 min', completed: false, type: 'action' },
      { id: '2-3', title: 'Lanches que ajudam', duration: '4 min', completed: false, type: 'read' },
    ],
  },
  {
    id: 3,
    title: 'Sono Reparador',
    subtitle: 'Quando o corpo transforma',
    description: 'Otimize suas noites para acordar renovada.',
    icon: 'moon',
    unlocked: false,
    progress: 0,
    lessons: [],
  },
  {
    id: 4,
    title: 'Movimento Natural',
    subtitle: 'Sem academia obrigatória',
    description: 'Encontre formas de se mexer que fazem sentido pra você.',
    icon: 'heart',
    unlocked: false,
    progress: 0,
    lessons: [],
  },
  {
    id: 5,
    title: 'Mente Leve',
    subtitle: 'A chave da constância',
    description: 'Como sua mentalidade influencia seu corpo.',
    icon: 'leaf',
    unlocked: false,
    progress: 0,
    lessons: [],
  },
];

const iconMap: Record<string, React.ReactNode> = {
  droplets: <Droplets size={24} />,
  apple: <Apple size={24} />,
  moon: <Moon size={24} />,
  heart: <Heart size={24} />,
  leaf: <Leaf size={24} />,
};

export function MethodScreen() {
  const { user } = useUser();

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
            Método Monjaro Natural
          </h1>
          <p className="text-text-secondary">
            5 pilares para uma transformação sustentável
          </p>
        </motion.div>
      </header>

      {/* Progress Overview */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-natural"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-secondary">Seu progresso geral</span>
            <span className="text-sm font-bold text-primary">12%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '12%' }} />
          </div>
        </motion.div>
      </div>

      {/* Pillars List */}
      <main className="px-6 space-y-4">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PillarCard pillar={pillar} isActive={user?.currentPillar === pillar.id} />
          </motion.div>
        ))}
      </main>
    </div>
  );
}

function PillarCard({ pillar, isActive }: { pillar: Pillar; isActive: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-300",
        pillar.unlocked
          ? "bg-card shadow-natural hover:shadow-glow cursor-pointer"
          : "bg-muted/50 opacity-70"
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
            pillar.unlocked
              ? isActive
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-primary"
              : "bg-muted text-text-muted"
          )}>
            {pillar.unlocked ? iconMap[pillar.icon] : <Lock size={20} />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-bold",
                pillar.unlocked ? "text-text-primary" : "text-text-muted"
              )}>
                {pillar.title}
              </h3>
              {isActive && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  Atual
                </span>
              )}
            </div>
            <p className={cn(
              "text-sm mt-0.5",
              pillar.unlocked ? "text-text-secondary" : "text-text-muted"
            )}>
              {pillar.subtitle}
            </p>

            {/* Progress for unlocked */}
            {pillar.unlocked && pillar.progress > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-muted">{pillar.lessons.filter(l => l.completed).length}/{pillar.lessons.length} lições</span>
                  <span className="text-primary font-medium">{pillar.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${pillar.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Arrow */}
          {pillar.unlocked && (
            <ChevronRight size={20} className="text-text-muted flex-shrink-0" />
          )}
        </div>

        {/* Lessons Preview for Active Pillar */}
        {isActive && pillar.lessons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {pillar.lessons.slice(0, 3).map((lesson) => (
              <div key={lesson.id} className="flex items-center gap-3 py-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  lesson.completed
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-text-muted"
                )}>
                  {lesson.completed ? <CheckCircle size={16} /> : <Play size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    lesson.completed ? "text-primary" : "text-text-primary"
                  )}>
                    {lesson.title}
                  </p>
                  <p className="text-xs text-text-muted">{lesson.duration}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
