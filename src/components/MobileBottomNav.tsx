import React from 'react';
import { HelpCircle, Code2, Bot, Award, BookOpen } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: 'quiz' | 'editor' | 'chat' | 'progress' | 'reference') => void;
  badgeCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  badgeCount = 0,
}) => {
  const tabs: Array<{
    id: 'quiz' | 'editor' | 'chat' | 'progress' | 'reference';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
    badge?: number;
  }> = [
    {
      id: 'quiz',
      label: 'Quizzes',
      icon: HelpCircle,
      highlight: true,
    },
    {
      id: 'editor',
      label: 'Editor SE38',
      icon: Code2,
    },
    {
      id: 'chat',
      label: 'Mentor IA',
      icon: Bot,
    },
    {
      id: 'progress',
      label: 'Progresso',
      icon: Award,
      badge: badgeCount > 0 ? badgeCount : undefined,
    },
    {
      id: 'reference',
      label: 'Dicionário',
      icon: BookOpen,
    },
  ];

  return (
    <nav 
      aria-label="Navegação Móvel Principal"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121f36]/95 backdrop-blur-md border-t border-[#253966] shadow-2xl px-2 py-1.5 flex items-center justify-around safe-area-pb"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all relative cursor-pointer ${
              isActive
                ? 'text-[#5bb2ff] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Indicator Top Dot */}
            {isActive && (
              <span className="absolute -top-1.5 w-6 h-1 bg-[#0070f2] rounded-full shadow-xs shadow-blue-500/50" />
            )}

            <div className="relative">
              <Icon 
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-[#0070f2]' : 'text-slate-400'
                }`} 
              />
              {tab.highlight && !isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#121f36]" />
              )}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-bold text-[9px] px-1 rounded-full font-mono">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
              isActive ? 'text-white font-bold' : 'text-slate-400 font-medium'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
