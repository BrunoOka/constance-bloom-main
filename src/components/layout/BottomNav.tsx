import { Home, BookOpen, Calendar, TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const baseNavItems: NavItem[] = [
  { id: 'today', label: 'Hoje', icon: <Home size={20} /> },
  { id: 'method', label: 'Método', icon: <BookOpen size={20} /> },
  { id: 'routine', label: 'Rotina', icon: <Calendar size={20} /> },
  { id: 'progress', label: 'Progresso', icon: <TrendingUp size={20} /> },
];

const weightLossNavItem: NavItem = { 
  id: 'weightloss', 
  label: 'Emagrecer', 
  icon: <Target size={20} /> 
};

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showWeightLoss?: boolean;
}

export function BottomNav({ activeTab, onTabChange, showWeightLoss = false }: BottomNavProps) {
  // Build nav items dynamically
  const navItems = showWeightLoss 
    ? [baseNavItems[0], weightLossNavItem, ...baseNavItems.slice(1)]
    : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-natural z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300",
                isActive
                  ? "text-primary bg-accent"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <span className={cn(
                "transition-transform duration-300",
                isActive && "scale-110"
              )}>
                {item.icon}
              </span>
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-primary" : "text-text-muted"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
