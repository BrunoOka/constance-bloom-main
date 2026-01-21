import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Leaf, Clock, Heart, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserProfile {
  name: string;
}

interface HelpScreenProps {
  user: UserProfile | null;
}

const quickQuestions = [
  { id: 1, text: 'O que fazer quando perco a motivação?', icon: <Heart size={16} /> },
  { id: 2, text: 'Como adaptar minha rotina?', icon: <Clock size={16} /> },
  { id: 3, text: 'O que comer no jantar?', icon: <Leaf size={16} /> },
];

export function HelpScreen({ user }: HelpScreenProps) {
  const userName = user?.name || 'querida';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá, ${userName}! 💚 Sou sua coach digital do Guia Monjaro Natural. Estou aqui para te ajudar a encontrar clareza no seu caminho. O que você precisa hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateResponse(messageText, userName);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <Sparkles className="text-primary-foreground" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Coach Digital
            </h1>
            <p className="text-sm text-text-secondary">
              Sua guia no método Monjaro Natural
            </p>
          </div>
        </motion.div>
      </header>

      {/* Info Banner */}
      <div className="px-6 mb-4">
        <div className="bg-accent/50 rounded-xl p-3 flex items-start gap-2">
          <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Posso te orientar sobre o método, rotina e motivação. 
            Para questões médicas, consulte um profissional.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card shadow-natural rounded-bl-md"
              )}>
                <p className={cn(
                  "text-sm leading-relaxed",
                  message.role === 'user' ? "text-primary-foreground" : "text-text-primary"
                )}>
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-2"
          >
            <p className="text-xs text-text-muted text-center mb-3">Perguntas frequentes</p>
            {quickQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSend(q.text)}
                className="w-full bg-card rounded-xl p-3 flex items-center gap-3 shadow-natural hover:shadow-glow transition-all duration-300 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary">
                  {q.icon}
                </div>
                <span className="text-sm text-text-primary">{q.text}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 pb-28 bg-gradient-to-t from-background to-transparent">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida..."
            className="flex-1 h-12 px-4 rounded-xl border border-border bg-card focus:border-primary focus:ring-0 outline-none transition-colors text-sm placeholder:text-text-muted"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            size="icon"
            className="h-12 w-12"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function generateResponse(question: string, name: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('motivação') || q.includes('ânimo') || q.includes('desanima')) {
    return `${name}, é completamente normal ter dias assim. O que diferencia quem transforma de quem desiste não é nunca cair — é voltar mais leve. Hoje, foque em uma única coisa simples. Pode ser só beber um copo de água. Amanhã, você decide o próximo passo. 💚`;
  }
  
  if (q.includes('rotina') || q.includes('adaptar') || q.includes('tempo')) {
    return `Entendo! A rotina precisa caber na sua vida real, não o contrário. Vamos simplificar: escolha apenas uma coisa do seu dia de hoje e faça com atenção. O resto pode esperar. Constância vem de fazer pouco bem feito, não muito mal feito. 🌿`;
  }
  
  if (q.includes('comer') || q.includes('jantar') || q.includes('almoço') || q.includes('fome')) {
    return `Para o jantar, pense assim: metade do prato com vegetais variados, um quarto com proteína (frango, peixe, ovo ou leguminosas) e um quarto com carboidrato (arroz, batata). Simples, nutritivo e sem neura. O mais importante é comer com calma e atenção. 🥗`;
  }
  
  if (q.includes('peso') || q.includes('emagrecer') || q.includes('balança')) {
    return `${name}, aqui focamos em como você se sente, não em números. A balança não conta a história completa do seu corpo. Pergunte-se: estou com mais energia? Dormindo melhor? Me sentindo mais leve? Esses são os sinais que importam. 💚`;
  }
  
  return `Ótima pergunta, ${name}! Baseado no método Monjaro Natural, o mais importante agora é focar no seu foco de hoje. Cada pequeno passo conta. Se precisar de algo mais específico sobre hidratação, alimentação ou rotina, me pergunte! Estou aqui pra te guiar. 🌱`;
}
