export interface Mission {
  day: number;
  title: string;
  description: string;
  phase: 'awareness' | 'choices' | 'autonomy';
}

export const missions: Mission[] = [
  // Fase 1: Consciência e observação (Dias 1-10)
  {
    day: 1,
    title: 'Água ao acordar',
    description: 'Beber um copo de água ao acordar, antes de qualquer outra coisa.',
    phase: 'awareness',
  },
  {
    day: 2,
    title: 'Comer com atenção',
    description: 'Comer mais devagar em pelo menos uma refeição, prestando atenção no sabor.',
    phase: 'awareness',
  },
  {
    day: 3,
    title: 'Reduzir carboidratos',
    description: 'Reduzir pães ou massas hoje, sem cortar totalmente.',
    phase: 'awareness',
  },
  {
    day: 4,
    title: 'Mais vegetais',
    description: 'Incluir frutas ou vegetais em pelo menos uma refeição.',
    phase: 'awareness',
  },
  {
    day: 5,
    title: 'Fome real',
    description: 'Evitar beliscar entre as refeições, se não estiver com fome real.',
    phase: 'awareness',
  },
  {
    day: 6,
    title: 'Momento de pausa',
    description: 'Separar 20 minutos do dia para relaxar ou desacelerar.',
    phase: 'awareness',
  },
  {
    day: 7,
    title: 'Movimento leve',
    description: 'Fazer uma caminhada leve ou algum movimento por cerca de 20 minutos.',
    phase: 'awareness',
  },
  {
    day: 8,
    title: 'Hidratação',
    description: 'Beber mais água ao longo do dia, sempre que lembrar.',
    phase: 'awareness',
  },
  {
    day: 9,
    title: 'Sem bebidas doces',
    description: 'Evitar bebidas adoçadas hoje, dando preferência à água.',
    phase: 'awareness',
  },
  {
    day: 10,
    title: 'Saciedade',
    description: 'Priorizar alimentos que tragam mais saciedade.',
    phase: 'awareness',
  },
  // Fase 2: Melhores escolhas (Dias 11-20)
  {
    day: 11,
    title: 'Menos açúcar',
    description: 'Reduzir o consumo de açúcar hoje, sem cobranças.',
    phase: 'choices',
  },
  {
    day: 12,
    title: 'Confortável, não cheio',
    description: 'Parar de comer ao se sentir confortável, não cheio.',
    phase: 'choices',
  },
  {
    day: 13,
    title: 'Sono reparador',
    description: 'Dormir um pouco mais cedo ou melhorar o horário de sono.',
    phase: 'choices',
  },
  {
    day: 14,
    title: 'Se movimentar',
    description: 'Fazer algum movimento leve: alongar, caminhar ou se mexer.',
    phase: 'choices',
  },
  {
    day: 15,
    title: 'Água matinal',
    description: 'Começar o dia com água antes da primeira refeição.',
    phase: 'choices',
  },
  {
    day: 16,
    title: 'Troca inteligente',
    description: 'Trocar um alimento ultraprocessado por algo mais natural.',
    phase: 'choices',
  },
  {
    day: 17,
    title: 'Mais fibras',
    description: 'Incluir fibras em pelo menos uma refeição.',
    phase: 'choices',
  },
  {
    day: 18,
    title: 'Escutar o corpo',
    description: 'Prestar atenção na fome antes de comer.',
    phase: 'choices',
  },
  {
    day: 19,
    title: 'Sem repetir',
    description: 'Evitar repetir o prato, se já estiver satisfeito.',
    phase: 'choices',
  },
  {
    day: 20,
    title: 'Respirar',
    description: 'Separar um momento do dia para respirar e desacelerar.',
    phase: 'choices',
  },
  // Fase 3: Autonomia e constância (Dias 21-30)
  {
    day: 21,
    title: '15 minutos ativos',
    description: 'Movimentar o corpo por pelo menos 15 minutos.',
    phase: 'autonomy',
  },
  {
    day: 22,
    title: 'Água vs vontade',
    description: 'Beber água quando sentir vontade de beliscar.',
    phase: 'autonomy',
  },
  {
    day: 23,
    title: 'Jantar leve',
    description: 'Optar por uma refeição mais leve à noite, se possível.',
    phase: 'autonomy',
  },
  {
    day: 24,
    title: 'Noite equilibrada',
    description: 'Reduzir carboidratos no período noturno, sem radicalismos.',
    phase: 'autonomy',
  },
  {
    day: 25,
    title: 'Presença',
    description: 'Comer com atenção, evitando distrações como celular ou TV.',
    phase: 'autonomy',
  },
  {
    day: 26,
    title: 'Escolhas conscientes',
    description: 'Escolher alimentos que mantenham a saciedade por mais tempo.',
    phase: 'autonomy',
  },
  {
    day: 27,
    title: 'Pausa consciente',
    description: 'Evitar comer por ansiedade, buscando outra pausa quando possível.',
    phase: 'autonomy',
  },
  {
    day: 28,
    title: 'Prazer e leveza',
    description: 'Fazer algo que gere prazer e relaxamento.',
    phase: 'autonomy',
  },
  {
    day: 29,
    title: 'Dia de escolhas',
    description: 'Manter boas escolhas ao longo do dia, sem cobrança.',
    phase: 'autonomy',
  },
  {
    day: 30,
    title: 'Reconhecer a constância',
    description: 'Reconhecer sua constância e decidir continuar.',
    phase: 'autonomy',
  },
];

export const completionMessages = [
  "Missão concluída. Um passo consistente.",
  "Constância gera resultados.",
  "Pequenas escolhas constroem mudanças.",
  "Você está mantendo o ritmo.",
  "Mais um dia de constância.",
  "Continue assim, um dia de cada vez.",
  "Seu corpo agradece cada escolha.",
  "Consistência é a chave.",
];

export const cycleCompleteMessage = "Ciclo concluído. Um novo ciclo começa amanhã. Continue no seu ritmo.";

export function getRandomCompletionMessage(): string {
  return completionMessages[Math.floor(Math.random() * completionMessages.length)];
}
