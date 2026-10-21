import React from 'react';
import { CycleConfig } from '../types';
import { Sparkles, Moon, Calendar, Heart, Flower2 } from 'lucide-react';

interface TopBarProps {
  config: CycleConfig;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCalibration: () => void;
  onOpenSanctuary: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  config,
  currentTab,
  onSelectTab,
  onOpenCalibration,
  onOpenSanctuary,
}) => {
  const navItems = [
    { id: 'sanctuary', label: 'Sanctuary', icon: Flower2 },
    { id: 'movement', label: 'Walk & Stretches', icon: Sparkles },
    { id: 'apothecary', label: 'Teas & Glow', icon: Heart },
    { id: 'oracle', label: 'Event Oracle', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#0c0514]/90 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('sanctuary')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-[1.5px] shadow-md">
              <div className="w-full h-full rounded-full bg-[#120718] flex items-center justify-center">
                <Moon className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-serif-goddess text-2xl font-bold tracking-wide text-amber-100">
                Attuned
              </span>
              <p className="text-[10px] tracking-wider uppercase text-pink-300/80 -mt-1 font-medium">
                Goddess Sanctuary
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Zone */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white/10 text-amber-200 border border-amber-300/30 shadow-sm font-semibold'
                    : 'text-pink-200/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-pink-300/70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Zone: PMDD Relief & Esther Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick PMDD Sanctuary Mode Button */}
          <button
            onClick={onOpenSanctuary}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/80 to-rose-500/80 border border-amber-300/40 text-white hover:border-amber-200 shadow-md shadow-black/30 transition-all active:scale-95"
            title="Instant Premenstrual Depression Relief"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
            <span className="font-serif-goddess tracking-wide hidden sm:inline">Sanctuary Mode</span>
            <span className="font-serif-goddess tracking-wide sm:hidden">Sanctuary</span>
          </button>

          {/* Esther Personal Goddess Avatar Button */}
          <button
            onClick={onOpenCalibration}
            className="group flex items-center gap-2 p-1 pr-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/50"
            title="Your Sacred Profile & Cycle Settings"
          >
            <div className="relative w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-300 via-rose-300 to-amber-400">
              <img
                src={config.userAvatar}
                alt={config.userName}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border border-[#0c0514]" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-serif-goddess font-semibold text-amber-100 group-hover:text-amber-200 transition-colors">
                {config.userName || 'Queen Esther'}
              </span>
              <span className="block text-[9px] text-pink-300/70 -mt-0.5">Cycle Settings</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-white/10 bg-[#0c0514]/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
                isActive ? 'text-amber-200 font-semibold' : 'text-pink-300/60 hover:text-pink-100'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
