import React from 'react';
import { CalculatedCycle, CycleConfig } from '../types';
import { Sparkles, Moon, Flower2, Heart, Footprints } from 'lucide-react';

interface GoddessAltarCardProps {
  cycle: CalculatedCycle;
  config: CycleConfig;
  onOpenSanctuary: () => void;
  onOpenCalibration: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GoddessAltarCard: React.FC<GoddessAltarCardProps> = ({
  cycle,
  config,
  onOpenSanctuary,
  onOpenCalibration,
  onNavigateTab,
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-300/25 bg-[#14081c]/90 backdrop-blur-xl shadow-2xl shadow-black/60">
      {/* Background artwork: African Gold Heirloom Jewelry with soft warm scrim */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-35 pointer-events-none">
        <img
          src="/assets/aistudio/312648399156378803_94ce392c.jpg"
          alt="African Gold Heirloom Cuffs"
          className="w-full h-full object-cover object-top filter brightness-85 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#14081c]/85 to-[#14081c]" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        {/* Left: Esther Photo & Royal Title */}
        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={onOpenCalibration}>
            {/* Elegant warm halo */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-300 via-rose-400 to-amber-500 blur-sm opacity-80 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-amber-200 via-pink-300 to-amber-400 overflow-hidden shadow-2xl">
              <img
                src={config.userAvatar}
                alt={config.userName}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-[#14081c] flex items-center justify-center text-xs shadow-md">
              👑
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-200 font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-300/30">
                Queen of the Sanctuary
              </span>
            </div>
            <h2 className="font-serif-goddess text-2xl sm:text-3xl font-bold text-amber-100">
              {config.userName || 'Queen Esther'}
            </h2>
            <p className="text-xs text-pink-200/80 font-light max-w-sm">
              Attuned to her sacred body, sovereign over her tides, and deeply gentle with her heart.
            </p>
          </div>
        </div>

        {/* Right: Quick Sacred Shortcuts */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('movement')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-pink-200 hover:text-amber-200 transition-colors backdrop-blur-md"
          >
            <Footprints className="w-3.5 h-3.5 text-amber-300" />
            <span>Sunset Walk</span>
          </button>

          <button
            onClick={() => onNavigateTab('apothecary')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-pink-200 hover:text-amber-200 transition-colors backdrop-blur-md"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            <span>Clove Tea</span>
          </button>

          <button
            onClick={onOpenSanctuary}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/90 to-rose-500/90 hover:from-amber-400 hover:to-rose-400 text-white font-medium text-xs shadow-lg shadow-black/40 transition-all active:scale-95 border border-amber-300/30"
          >
            <Moon className="w-3.5 h-3.5 text-amber-100" />
            <span>PMDD Sanctuary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
