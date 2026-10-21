import React, { useState, useEffect } from 'react';
import { HERBAL_TEAS, GLOW_MASKS } from '../data/cycles';
import { CalculatedCycle, HerbalTeaRecipe, GlowMaskRecipe } from '../types';
import { Coffee, Sparkles, Clock, Check, Heart, Play, Pause, RotateCcw } from 'lucide-react';

interface ApothecarySectionProps {
  cycle: CalculatedCycle;
  userName: string;
}

export const ApothecarySection: React.FC<ApothecarySectionProps> = ({ cycle, userName }) => {
  const [activeTab, setActiveTab] = useState<'teas' | 'glow'>('teas');
  const [selectedTea, setSelectedTea] = useState<HerbalTeaRecipe>(HERBAL_TEAS[0]);
  const [selectedMask, setSelectedMask] = useState<GlowMaskRecipe>(GLOW_MASKS[0]);

  // Tea Brew Timer
  const [steepSeconds, setSteepSeconds] = useState<number>(300); // 5 mins
  const [isSteeping, setIsSteeping] = useState<boolean>(false);
  const [steepComplete, setSteepComplete] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSteeping && steepSeconds > 0) {
      interval = setInterval(() => setSteepSeconds((prev) => prev - 1), 1000);
    } else if (steepSeconds === 0 && isSteeping) {
      setIsSteeping(false);
      setSteepComplete(true);
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(528, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2);
      } catch {}
    }
    return () => clearInterval(interval);
  }, [isSteeping, steepSeconds]);

  const handleStartBrew = (mins: number) => {
    setSteepSeconds(mins * 60);
    setIsSteeping(true);
    setSteepComplete(false);
  };

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8">
      {/* Header & Category Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-goddess text-2xl sm:text-3xl font-bold text-pink-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            Kitchen Apothecary & Goddess Glow Pantry
          </h3>
          <p className="text-xs text-pink-300/80 mt-1">
            Nourishing remedies crafted from hibiscus, whole cloves, fresh ginger, raw honey, and sun-ripened tomatoes.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-fuchsia-950/60 border border-fuchsia-800/40 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('teas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'teas'
                ? 'bg-gradient-to-r from-rose-700 to-pink-600 text-white shadow-md'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Sacred Herbal Teas</span>
          </button>
          <button
            onClick={() => setActiveTab('glow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'glow'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Natural Face Masks</span>
          </button>
        </div>
      </div>

      {/* TEAS VIEW */}
      {activeTab === 'teas' && (
        <div className="space-y-6">
          {/* Tea Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HERBAL_TEAS.map((tea) => {
              const isSelected = selectedTea.id === tea.id;
              const isRecommended = tea.phase === cycle.phase || tea.phase === 'all';
              return (
                <div
                  key={tea.id}
                  onClick={() => {
                    setSelectedTea(tea);
                    setSteepSeconds(420);
                    setIsSteeping(false);
                    setSteepComplete(false);
                  }}
                  className={`relative p-5 rounded-3xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-b from-fuchsia-950/90 to-purple-950/90 border-amber-400 shadow-xl shadow-rose-950/50 scale-102'
                      : 'bg-[#180922]/70 hover:bg-[#180922]/90 border-fuchsia-900/30'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute top-4 right-4 text-[9px] uppercase font-mono tracking-wider text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
                      Phase Aligned
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-700 to-amber-600 flex items-center justify-center mb-3">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-serif-goddess text-lg font-bold text-pink-100">
                    {tea.name}
                  </h4>
                  <p className="text-xs text-pink-300/70 mt-1 line-clamp-2">
                    {tea.subtitle}
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-3 font-medium">
                    Best Time: {tea.bestTime}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Tea Detail & Steeping Companion */}
          <div className="relative rounded-3xl overflow-hidden border border-amber-300/20 bg-[#160a1e]/90 backdrop-blur-xl shadow-2xl shadow-black/70">
            {/* Background Image: Sensual pleasure flower petal bath with soft warm scrim */}
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-30 pointer-events-none">
              <img
                src="/assets/aistudio/605804587408707259_3a621ee3.jpg"
                alt="Sensual Pleasure & Flower Bath"
                className="w-full h-full object-cover object-center filter brightness-85 contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#160a1e]/85 to-[#160a1e]" />
            </div>

            <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row items-start justify-between gap-8">
              {/* Left Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-200">
                    Sacred Alchemy Recipe
                  </span>
                  <h4 className="font-serif-goddess text-2xl sm:text-3xl font-bold text-amber-100 mt-0.5">
                    {selectedTea.name}
                  </h4>
                  <p className="text-xs text-pink-200/80">{selectedTea.subtitle}</p>
                </div>

                {/* Healing Properties */}
                <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs text-pink-100 leading-relaxed font-light">
                  <span className="font-serif-goddess font-semibold text-amber-200 mr-1.5">
                    Hormonal Medicine:
                  </span>
                  {selectedTea.healingProperties}
                </div>

                {/* Ingredients & Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <span className="text-xs font-serif-goddess font-semibold text-pink-200">
                      Sacred Ingredients:
                    </span>
                    <ul className="space-y-1 text-xs text-pink-100/80 list-disc list-inside font-light">
                      {selectedTea.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-serif-goddess font-semibold text-pink-200">
                      Brewing Steps:
                    </span>
                    <ol className="space-y-1 text-xs text-pink-100/80 list-decimal list-inside font-light">
                      {selectedTea.instructions.map((ins, idx) => (
                        <li key={idx}>{ins}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Right: Steep Timer */}
              <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shrink-0 w-full sm:w-64 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-wider text-amber-200/80 font-mono mb-2">
                  Steeping Timer
                </span>

                <div className="w-32 h-32 rounded-full border border-white/15 flex items-center justify-center mb-3 bg-black/50 shadow-inner">
                  <div
                    className={`text-3xl font-mono tabular-nums ${
                      steepComplete ? 'text-emerald-300' : 'text-amber-100'
                    }`}
                  >
                    {steepComplete ? <Check className="w-10 h-10 text-emerald-300" /> : formatTimer(steepSeconds)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSteeping(!isSteeping)}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500/90 to-rose-500/90 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-medium flex items-center gap-1.5 border border-white/10"
                  >
                    {isSteeping ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isSteeping ? 'Pause' : 'Steep 7 Mins'}</span>
                  </button>
                  <button
                    onClick={() => handleStartBrew(7)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-300"
                    title="Reset to 7 mins"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOW PANTRY VIEW */}
      {activeTab === 'glow' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GLOW_MASKS.map((mask) => {
              const isSelected = selectedMask.id === mask.id;
              return (
                <div
                  key={mask.id}
                  onClick={() => setSelectedMask(mask)}
                  className={`relative p-5 rounded-3xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-b from-fuchsia-950/90 to-purple-950/90 border-amber-400 shadow-xl shadow-rose-950/50 scale-102'
                      : 'bg-[#180922]/70 hover:bg-[#180922]/90 border-fuchsia-900/30'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-serif-goddess text-xl font-bold text-pink-100">
                    {mask.name}
                  </h4>
                  <p className="text-xs text-pink-300/70 mt-1">{mask.subtitle}</p>
                  <p className="text-[11px] text-amber-300/80 mt-3 font-mono">
                    Prep Time: {mask.prepTimeMinutes} Mins
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mask Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#220d2e]/90 to-[#120619]/90 border border-fuchsia-800/40 shadow-xl shadow-purple-950/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  Natural Goddess Skincare Ritual
                </span>
                <h4 className="font-serif-goddess text-2xl sm:text-3xl font-bold text-pink-100 mt-0.5">
                  {selectedMask.name}
                </h4>
                <p className="text-xs text-pink-300/70">{selectedMask.subtitle}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-fuchsia-950/50 border border-fuchsia-700/30 text-xs text-pink-100 leading-relaxed font-light">
              <span className="font-serif-goddess font-semibold text-amber-200 mr-1.5">
                Skin Glow Magic:
              </span>
              {selectedMask.skinBenefits}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <span className="text-xs font-serif-goddess font-semibold text-pink-200">
                  Ingredients:
                </span>
                <ul className="space-y-1 text-xs text-pink-200/80 list-disc list-inside font-light">
                  {selectedMask.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-serif-goddess font-semibold text-pink-200">
                  Application Ritual:
                </span>
                <ol className="space-y-1 text-xs text-pink-200/80 list-decimal list-inside font-light">
                  {selectedMask.instructions.map((ins, idx) => (
                    <li key={idx}>{ins}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
