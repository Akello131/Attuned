import React, { useState } from 'react';
import { GODDESS_AFFIRMATIONS } from '../data/cycles';
import { CalculatedCycle } from '../types';
import { Sparkles, Volume2, Copy, Check, RefreshCw } from 'lucide-react';

interface GoddessAffirmationProps {
  cycle: CalculatedCycle;
  userName: string;
}

export const GoddessAffirmation: React.FC<GoddessAffirmationProps> = ({ cycle, userName }) => {
  // Find affirmation for this phase or general
  const phaseAffirmations = GODDESS_AFFIRMATIONS.filter(
    (a) => a.phase === cycle.phase || a.phase === 'all'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentAffirmation = phaseAffirmations[currentIndex % phaseAffirmations.length] || GODDESS_AFFIRMATIONS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${currentAffirmation.quote}" — ${currentAffirmation.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentAffirmation.quote);
    utterance.rate = 0.85; // slow, gentle, meditative
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-300/20 bg-[#160a1e]/90 backdrop-blur-xl p-6 sm:p-7 shadow-2xl shadow-black/60">
      {/* Background artwork: Divine Feminine Energy poster with warm sunset overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/aistudio/Divine_Feminine_Energy_-_how_to_unlock_your_feminine_energy_0ac9865d.jpg"
          alt="Divine Feminine Energy"
          className="w-full h-full object-cover object-center filter brightness-45 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120718]/95 via-[#120718]/85 to-[#120718]/70" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Top Tag & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-serif-goddess font-semibold uppercase tracking-widest text-amber-200">
              Daily Goddess Oracle · {currentAffirmation.focus}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-xl border transition-colors backdrop-blur-md ${
                isSpeaking
                  ? 'bg-amber-400/30 border-amber-300 text-amber-200'
                  : 'bg-black/30 border-white/10 text-pink-200 hover:text-white'
              }`}
              title="Listen to affirmation aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl bg-black/30 border border-white/10 text-pink-200 hover:text-white transition-colors backdrop-blur-md"
              title="Copy affirmation"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-pink-200" />}
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-black/30 border border-white/10 text-pink-200 hover:text-white transition-colors backdrop-blur-md"
              title="Draw another card"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Affirmation Quote */}
        <blockquote className="my-1">
          <p className="font-serif-goddess text-xl sm:text-2xl italic font-medium leading-relaxed text-amber-100">
            &ldquo;{currentAffirmation.quote}&rdquo;
          </p>
          <footer className="mt-2.5 text-xs text-pink-200/80 font-sans-goddess flex items-center gap-2">
            <span>Devoted to Queen {userName || 'Esther'}</span>
            <span aria-hidden="true">·</span>
            <span>{currentAffirmation.author}</span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
};
