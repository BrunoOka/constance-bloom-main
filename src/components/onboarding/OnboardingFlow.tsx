import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Sun, Moon, Zap, Heart, Target, Clock, Users, Sparkles, ArrowRight, Calendar, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface OnboardingStep {
  id: string;
  question: string;
  subtitle: string;
  options: {
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    question: 'Como posso te chamar?',
    subtitle: 'Vamos começar pelo seu nome 💚',
    options: [],
  },
  {
    id: 'goal',
    question: 'O que você mais busca agora?',
    subtitle: 'Escolha o que faz mais sentido pra você',
    options: [
      { value: 'weightloss', label: 'Emagrecer', description: 'Perder peso com constância e sem dietas restritivas', icon: <Target size={24} /> },
      { value: 'energy', label: 'Mais energia', description: 'Acordar disposta e manter o pique', icon: <Zap size={24} /> },
      { value: 'lightness', label: 'Leveza no corpo', description: 'Menos inchaço, mais conforto', icon: <Leaf size={24} /> },
      { value: 'balance', label: 'Equilíbrio', description: 'Parar de oscilar tanto', icon: <Heart size={24} /> },
    ],
  },
  {
    id: 'challenge',
    question: 'Qual é seu maior desafio hoje?',
    subtitle: 'Seja honesta, isso nos ajuda a te guiar melhor',
    options: [
      { value: 'routine', label: 'Criar rotina', description: 'Começo e paro sempre', icon: <Calendar size={24} /> },
      { value: 'motivation', label: 'Manter motivação', description: 'Perco o ânimo rápido', icon: <Sparkles size={24} /> },
      { value: 'knowledge', label: 'Saber o que fazer', description: 'Muita informação, pouca clareza', icon: <Target size={24} /> },
      { value: 'time', label: 'Falta de tempo', description: 'Vida corrida demais', icon: <Clock size={24} /> },
    ],
  },
  {
    id: 'rhythm',
    question: 'Como você prefere avançar?',
    subtitle: 'Vamos no seu ritmo, sempre',
    options: [
      { value: 'calm', label: 'Devagar e constante', description: 'Pequenos passos, sem pressa', icon: <Moon size={24} /> },
      { value: 'moderate', label: 'Ritmo equilibrado', description: 'Desafios moderados', icon: <Sun size={24} /> },
      { value: 'intense', label: 'Quero intensidade', description: 'Gosto de me desafiar', icon: <Zap size={24} /> },
    ],
  },
  {
    id: 'support',
    question: 'Quanto suporte você precisa?',
    subtitle: 'Pra saber como te acompanhar',
    options: [
      { value: 'minimal', label: 'Só o essencial', description: 'Me dá a direção, eu sigo', icon: <Target size={24} /> },
      { value: 'regular', label: 'Lembretes ajudam', description: 'Gosto de ser lembrada', icon: <Users size={24} /> },
      { value: 'intensive', label: 'Bastante suporte', description: 'Preciso de acompanhamento', icon: <Heart size={24} /> },
    ],
  },
  {
    id: 'account',
    question: 'Crie sua conta',
    subtitle: 'Para salvar seu plano personalizado',
    options: [],
  },
];

export interface OnboardingData {
  name: string;
  rhythm: string;
  consistency: string;
  supportLevel: string;
  morningPerson: boolean;
  mainGoal: string;
  currentChallenge: string;
}

export interface OnboardingFlowProps {
  onComplete: (data: OnboardingData, credentials?: { email: string; password: string; mode: 'signup' | 'login' }) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = steps[currentStep];
  const isNameStep = step.id === 'welcome';
  const isAccountStep = step.id === 'account';
  const isLastStep = currentStep === steps.length - 1;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    if (isLastStep) {
      // Should not happen for selection steps if account is last
      completeOnboarding(newAnswers);
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 6) {
      completeOnboarding(answers, { email, password, mode: isLogin ? 'login' : 'signup' });
    }
  };

  const completeOnboarding = (finalAnswers: Record<string, string>, credentials?: { email: string; password: string; mode: 'signup' | 'login' }) => {
    onComplete({
      name: name,
      rhythm: finalAnswers.rhythm || 'moderate',
      consistency: 'starting',
      supportLevel: finalAnswers.support || 'regular',
      morningPerson: true,
      mainGoal: finalAnswers.goal || 'balance',
      currentChallenge: finalAnswers.challenge || 'routine',
    }, credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${index <= currentStep ? 'bg-primary' : 'bg-border'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-text-primary leading-tight">
                {isAccountStep && isLogin ? 'Acesse sua conta' : step.question}
              </h1>
              <p className="text-text-secondary">
                {step.subtitle}
              </p>
            </div>

            {/* Name Input */}
            {isNameStep ? (
              <div className="space-y-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu primeiro nome"
                  className="w-full h-14 px-5 text-lg rounded-2xl border-2 border-border bg-card focus:border-primary focus:ring-0 outline-none transition-colors placeholder:text-text-muted"
                  autoFocus
                />
                <Button
                  onClick={handleNameSubmit}
                  disabled={!name.trim()}
                  className="w-full gap-2"
                  size="lg"
                >
                  Continuar
                  <ArrowRight size={20} />
                </Button>
              </div>
            ) : isAccountStep ? (
              /* Account Inputs */
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={!email || password.length < 6}
                >
                  {isLogin ? 'Entrar' : 'Finalizar Cadastro'}
                  <ArrowRight size={20} />
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                  </button>
                </div>
              </form>
            ) : (
              /* Options */
              <div className="space-y-3">
                {step.options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${answers[step.id] === option.value
                      ? 'border-primary bg-accent shadow-natural'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-natural'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${answers[step.id] === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-primary'
                        }`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary">
                          {option.label}
                        </p>
                        <p className="text-sm text-text-secondary mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Element */}
      <div className="pb-12 flex justify-center">
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Leaf size={16} className="text-primary" />
          <span>Guia Monjaro Natural</span>
        </div>
      </div>
    </div>
  );
}
