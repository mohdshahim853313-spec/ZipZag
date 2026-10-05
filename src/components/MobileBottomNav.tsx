import React from 'react';
import { Home, Grid, Trophy, BookOpen, Settings } from 'lucide-react';

export type NavTab = 'home' | 'game' | 'levels' | 'scores' | 'guide' | 'settings';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onNavigate: (tab: 'home' | 'levels' | 'scores' | 'guide' | 'settings') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onNavigate,
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home, color: 'text-orange-600', activeBg: 'bg-orange-100/90 text-orange-600' },
    { id: 'levels' as const, label: 'Levels', icon: Grid, color: 'text-orange-600', activeBg: 'bg-orange-100/90 text-orange-600' },
    { id: 'scores' as const, label: 'Scores', icon: Trophy, color: 'text-amber-600', activeBg: 'bg-amber-100/90 text-amber-700' },
    { id: 'guide' as const, label: 'Guide', icon: BookOpen, color: 'text-orange-600', activeBg: 'bg-orange-100/90 text-orange-600' },
    { id: 'settings' as const, label: 'Settings', icon: Settings, color: 'text-slate-900', activeBg: 'bg-slate-200/90 text-slate-900' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 pt-1.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:hidden select-none shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 min-w-0 py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? `${tab.color} font-black`
                  : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? `${tab.activeBg} shadow-2xs scale-105` : 'hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-black' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
