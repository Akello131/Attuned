import React, { useState } from 'react';
import { CalculatedCycle, MoodCheckin } from '../types';
import { Heart, Sparkles, Smile, ShieldAlert, Check, Calendar, ArrowRight } from 'lucide-react';

interface MoodCompassProps {
  cycle: CalculatedCycle;
  userName: string;
  onLogCheckin: (checkin: MoodCheckin) => void;
  recentCheckins: MoodCheckin[];
  onOpenSanctuary: () => void;
}

const SPIRIT_OPTIONS = [
  { id: 'peaceful', label: 'Peaceful & Still', emoji: '🌸', pmddTrigger: false },
  { id: 'creative', label: 'Creative & Inspired', emoji: '✨', pmddTrigger: false },
  { id: 'sensual', label: 'Sensual & Magnetic', emoji: '🔥', pmddTrigger: false },
  { id: 'weepy', label: 'Weepy & Melancholic', emoji: '💧', pmddTrigger: true },
  { id: 'anxious', label: 'Anxious / Restless', emoji: '🌪️', pmddTrigger: true },
  { id: 'irritable', label: 'Irritable / Sensitive', emoji: '⚡', pmddTrigger: true },
  { id: 'exhausted', label: 'Heavy & Depleted', emoji: '🌙', pmddTrigger: true },
  { id: 'grounded', label: 'Deeply Grounded', emoji: '🌿', pmddTrigger: false },
];

const BODY_OPTIONS = [
  { id: 'cramping', label: 'Cramping / Uterine Ache', icon: '🩸' },
  { id: 'tender_breasts', label: 'Tender Breasts', icon: '🌸' },
  { id: 'bloated', label: 'Bloating & Water Retention', icon: '🌊' },
  { id: 'heavy_limbs', label: 'Heavy Limbs / Sluggish', icon: '🪨' },
  { id: 'pelvis_tight', label: 'Tight Hips & Pelvis', icon: '🦋' },
  { id: 'headache', label: 'Hormonal Headache / Fog', icon: '☁️' },
  { id: 'radiant', label: 'Radiant Glow & High Vitality', icon: '☀️' },
];

export const MoodCompass: React.FC<MoodCompassProps> = ({
  cycle,
  userName,
  onLogCheckin,
  recentCheckins,
  onOpenSanctuary,
}) => {
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['peaceful']);
  const [selectedBodies, setSelectedBodies] = useState<string[]>([]);
  const [energyScore, setEnergyScore] = useState<number>(3);
  const [journalNote, setJournalNote] = useState<string>('');
  const [loggedToday, setLoggedToday] = useState(false);

  const toggleMood = (id: string) => {
    setSelectedMoods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleBody = (id: string) => {
    setSelectedBodies((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Determine if PMDD support banner should trigger
  const hasPmddFlag = selectedMoods.some((m) =>
    ['weepy', 'anxious', 'irritable', 'exhausted'].includes(m)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheckin: MoodCheckin = {
      id: `checkin-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      cycleDay: cycle.currentCycleDay,
      phase: cycle.phase,
      moods: selectedMoods,
      physicalSensations: selectedBodies,
      energyScore,
      note: journalNote.trim() || undefined,
      pmddAlert: hasPmddFlag,
    };

    onLogCheckin(newCheckin);
    setLoggedToday(true);
    setTimeout(() => setLoggedToday(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* PMDD Compassionate Guidance Box when triggered */}
      {hasPmddFlag && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/70 via-fuchsia-950/80 to-purple-950/80 border border-amber-400/40 shadow-xl shadow-rose-950/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif-goddess text-lg font-bold text-amber-200">
                  Premenstrual Emotional Support for Queen {userName}
                </h4>
                <p className="text-xs text-pink-200/90 leading-relaxed font-light">
                  You logged feeling heavy, tearful, or anxious on Day {cycle.currentCycleDay}. Your brain’s serotonin and GABA receptors are navigating a sudden hormonal plunge. <span className="text-pink-300 font-medium">This is not who you are—it is a temporary biological tide.</span>
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSanctuary}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-medium text-xs tracking-wide shrink-0 transition-all shadow-md shadow-rose-950/60 flex items-center gap-1.5"
            >
              <span>Enter Sanctuary Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Checkin Form */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#150a1d]/85 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-300/25 flex items-center justify-center">
              <Heart className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif-goddess text-xl font-bold text-amber-100">
                Daily Body & Spirit Check-In
              </h3>
              <p className="text-xs text-pink-200/80">
                Attune to your emotions, pelvis, and energy on Cycle Day {cycle.currentCycleDay}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-200 px-2.5 py-1 rounded-full bg-black/40 border border-amber-300/20">
            {cycle.phaseDetails.name}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          {/* Spirit State */}
          <div className="space-y-2">
            <label className="text-xs font-serif-goddess font-semibold text-pink-200 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-amber-300" />
              How is your spirit feeling today?
            </label>
            <div className="flex flex-wrap gap-2">
              {SPIRIT_OPTIONS.map((item) => {
                const isSelected = selectedMoods.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleMood(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500/90 to-amber-500/90 text-white border border-amber-300/40 shadow-md shadow-black/30 scale-102 font-semibold'
                        : 'bg-black/30 hover:bg-black/50 text-pink-200/80 border border-white/5'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Physical Sensations */}
          <div className="space-y-2">
            <label className="text-xs font-serif-goddess font-semibold text-pink-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              What is your body communicating?
            </label>
            <div className="flex flex-wrap gap-2">
              {BODY_OPTIONS.map((item) => {
                const isSelected = selectedBodies.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleBody(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border border-amber-400/50 shadow-md shadow-rose-950/40'
                        : 'bg-white/5 hover:bg-white/10 text-pink-200/80 border border-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy Level Slider */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-800/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif-goddess font-semibold text-pink-200">
                Vitality & Energy Scale
              </label>
              <span className="text-xs font-mono font-semibold text-amber-300">
                {energyScore === 1 && 'Deep Rest Mode (1/5)'}
                {energyScore === 2 && 'Gentle / Slower Pace (2/5)'}
                {energyScore === 3 && 'Balanced & Grounded (3/5)'}
                {energyScore === 4 && 'Vibrant & Open (4/5)'}
                {energyScore === 5 && 'Sovereign Radiance (5/5)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={energyScore}
              onChange={(e) => setEnergyScore(parseInt(e.target.value) || 3)}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Short Sacred Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-serif-goddess font-semibold text-pink-200">
              Sacred Reflections or Whispers (Optional)
            </label>
            <textarea
              rows={2}
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="e.g., Felt a soft heaviness in my chest today, looking forward to my evening hibiscus tea..."
              className="w-full bg-[#120718] border border-fuchsia-700/40 rounded-xl p-3 text-xs text-pink-100 placeholder:text-pink-400/40 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-pink-400/70">
              Stored 100% locally on your phone
            </span>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white font-medium text-xs tracking-wide transition-all shadow-md shadow-pink-950/50 flex items-center gap-2 active:scale-95"
            >
              {loggedToday ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Check-In Recorded!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Record Today’s Check-In</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recent History Journal Snippets */}
      {recentCheckins.length > 0 && (
        <div className="p-5 rounded-3xl bg-fuchsia-950/20 border border-fuchsia-900/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-serif-goddess font-semibold text-pink-200">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Recent Reflections</span>
          </div>
          <div className="space-y-2">
            {recentCheckins.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#14061b]/60 border border-fuchsia-800/20 text-xs text-pink-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-amber-200 mr-2">
                    Day {item.cycleDay} ({item.phase})
                  </span>
                  <span className="text-[11px] text-pink-300/70">
                    {item.moods.join(' · ')}
                  </span>
                  {item.note && (
                    <p className="text-[11px] text-pink-300/80 italic mt-0.5">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-pink-400/60 font-mono shrink-0">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
