import React, { useState, useEffect } from 'react';
import { STRETCHES } from '../data/cycles';
import { CalculatedCycle, StretchExercise } from '../types';
import { Sparkles, Play, Pause, RotateCcw, Clock, Footprints, Flower2, Check } from 'lucide-react';

interface MovementSectionProps {
  cycle: CalculatedCycle;
  userName: string;
}

export const MovementSection: React.FC<MovementSectionProps> = ({ cycle, userName }) => {
  const [activeStretch, setActiveStretch] = useState<StretchExercise>(STRETCHES[0]);
  const [timerRemaining, setTimerRemaining] = useState<number>(activeStretch.durationSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerCompleted, setTimerCompleted] = useState<boolean>(false);

  // Play / Pause stretch timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      setTimerCompleted(true);
      // Play gentle completion chime
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2);
      } catch {}
    }

    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining]);

  const selectStretch = (exercise: StretchExercise) => {
    setActiveStretch(exercise);
    setTimerRemaining(exercise.durationSeconds);
    setTimerRunning(false);
    setTimerCompleted(false);
  };

  const handleResetTimer = () => {
    setTimerRemaining(activeStretch.durationSeconds);
    setTimerRunning(false);
    setTimerCompleted(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8">
      {/* Hero: Evening Sunset Walks Banner with User's Uploaded Sunset Silhouette Image */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-xl shadow-purple-950/50">
        <div className="absolute inset-0">
          <img
            src="/assets/aistudio/Mermaid_79b1d162.jpg"
            alt="Evening Sunset Stroll"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120718]/95 via-[#120718]/80 to-transparent sm:w-2/3" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-xl space-y-4">
          <div className="flex items-center gap-2">
            <Footprints className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-serif-goddess font-semibold uppercase tracking-wider text-amber-200">
              Golden Hour Ritual · Grounding Walk
            </span>
          </div>

          <h3 className="font-serif-goddess text-2xl sm:text-3xl font-bold text-pink-100">
            Evening Sunset Walks for Queen {userName}
          </h3>

          <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed font-light">
            When dusk settles, step outside for a slow, mindful walk. In your current{' '}
            <strong className="text-amber-300 font-serif-goddess">{cycle.phaseDetails.season}</strong>, walking
            under the setting sun lowers evening cortisol spikes, triggers natural melatonin release, and melts
            away premenstrual mental fatigue.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-xs text-amber-200 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Recommended Duration: 20–30 mins</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 border border-pink-400/40 text-xs text-pink-200 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Pacing: Gentle & Unhurried</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hip Openers & Stretches Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif-goddess text-2xl font-bold text-pink-100 flex items-center gap-2">
            <Flower2 className="w-6 h-6 text-pink-400" />
            Phase-Synced Hip Openers & Somatic Flow
          </h3>
          <p className="text-xs text-pink-300/80">
            Your pelvis and hips hold stored emotional weight, cyclic fluid, and hormonal tension. Choose an opening ritual below:
          </p>
        </div>

        {/* Stretch Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {STRETCHES.map((exercise) => {
            const isSelected = activeStretch.id === exercise.id;
            return (
              <button
                key={exercise.id}
                onClick={() => selectStretch(exercise)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-b from-fuchsia-950 to-purple-950 border-amber-400 text-pink-100 shadow-lg shadow-purple-950/60 scale-102'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-pink-200/70 hover:text-pink-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300/80">
                    {Math.round(exercise.durationSeconds / 60)} Min
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                </div>
                <h4 className="font-serif-goddess text-sm font-semibold truncate text-pink-100">
                  {exercise.name}
                </h4>
                <p className="text-[10px] text-pink-300/60 truncate font-mono mt-0.5">
                  {exercise.sanskrit}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Stretch Spotlight & Interactive Timer */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-300/20 bg-[#160a1e]/90 backdrop-blur-xl shadow-2xl shadow-black/70">
          {/* Background image: African Queen in lush sunlit grove with orange wrap */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-30 pointer-events-none">
            <img
              src="/assets/aistudio/956170564654301388_3dd2164e.jpg"
              alt="Nature Grounding Flow"
              className="w-full h-full object-cover object-top filter brightness-80 contrast-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#160a1e]/85 to-[#160a1e]" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Info & Steps */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-200 font-mono">
                  {activeStretch.sanskrit}
                </span>
                <h4 className="font-serif-goddess text-2xl sm:text-3xl font-bold text-amber-100 mt-0.5">
                  {activeStretch.name}
                </h4>
                <p className="text-xs text-pink-200/80 mt-1">
                  Target: <strong className="text-amber-200 font-medium">{activeStretch.target}</strong>
                </p>
              </div>

              {/* Goddess Wisdom */}
              <div className="p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs text-pink-100/90 leading-relaxed font-light">
                <span className="font-serif-goddess font-semibold text-amber-200 mr-1.5">
                  Sacred Anatomy Wisdom:
                </span>
                {activeStretch.goddessWisdom}
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <span className="text-xs font-serif-goddess font-semibold text-pink-200">
                  Step-by-Step Guidance:
                </span>
                <ol className="space-y-1.5 text-xs text-pink-100/80 list-decimal list-inside font-light">
                  {activeStretch.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right: Interactive Sacred Timer */}
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shrink-0 w-full sm:w-64">
              <span className="text-[10px] uppercase tracking-wider text-amber-200/80 font-mono mb-2">
                Stretch Timer
              </span>

              {/* Timer Display */}
              <div className="relative w-36 h-36 rounded-full border border-white/15 flex items-center justify-center mb-4 bg-black/50 shadow-inner">
                <div
                  className={`text-4xl font-light font-mono tabular-nums ${
                    timerCompleted ? 'text-emerald-300' : 'text-amber-100'
                  }`}
                >
                  {timerCompleted ? <Check className="w-12 h-12 text-emerald-300" /> : formatTime(timerRemaining)}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500/90 to-rose-500/90 hover:from-amber-400 hover:to-rose-400 text-white font-medium text-xs tracking-wide transition-all shadow-md active:scale-95 border border-white/10"
                >
                  {timerRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{timerCompleted ? 'Begin Again' : 'Begin'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="p-2.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 text-pink-200 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
