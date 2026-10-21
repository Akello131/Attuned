import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Moon, Wind, Volume2, VolumeX, X, Coffee, Flower2 } from 'lucide-react';
import { CalculatedCycle } from '../types';

interface SanctuaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycle: CalculatedCycle;
  userName: string;
  onSelectAction?: (action: 'tea' | 'stretch') => void;
}

export const SanctuaryModal: React.FC<SanctuaryModalProps> = ({
  isOpen,
  onClose,
  cycle,
  userName,
  onSelectAction,
}) => {
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCounter, setBreathCounter] = useState(4);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillatorNodes, setOscillatorNodes] = useState<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);

  // 4-7-8 Breathing Loop
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev > 1) return prev - 1;

        if (breathState === 'Inhale') {
          setBreathState('Hold');
          return 7;
        } else if (breathState === 'Hold') {
          setBreathState('Exhale');
          return 8;
        } else {
          setBreathState('Inhale');
          return 4;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, breathState]);

  // Offline Web Audio 432Hz Calm Harmonic Drone
  const toggleSound = () => {
    try {
      if (isPlayingAudio) {
        if (oscillatorNodes) {
          oscillatorNodes.gain.gain.exponentialRampToValueAtTime(0.0001, audioContext!.currentTime + 0.5);
          setTimeout(() => {
            oscillatorNodes.osc1.stop();
            oscillatorNodes.osc2.stop();
            setOscillatorNodes(null);
          }, 500);
        }
        setIsPlayingAudio(false);
      } else {
        const ctx = audioContext || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        setAudioContext(ctx);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);
        gainNode.connect(ctx.destination);

        // 432 Hz Healing Root & 648 Hz Perfect Fifth
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(432, ctx.currentTime);
        osc1.connect(gainNode);
        osc1.start();

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(648, ctx.currentTime);
        osc2.connect(gainNode);
        osc2.start();

        setOscillatorNodes({ osc1, osc2, gain: gainNode });
        setIsPlayingAudio(true);
      }
    } catch {
      // Audio not permitted or supported
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorNodes) {
        try {
          oscillatorNodes.osc1.stop();
          oscillatorNodes.osc2.stop();
        } catch {}
      }
    };
  }, [oscillatorNodes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#140a1c] border border-amber-300/20 rounded-3xl shadow-2xl shadow-black/80 text-pink-100 overflow-hidden">
        {/* Full modal background photo: African Moon Goddess with measured scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/1004795366864766055_c9296eb8.jpg"
            alt="African Moon Goddess"
            className="w-full h-full object-cover object-top filter brightness-65 contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100617] via-[#100617]/75 to-[#100617]/60" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between">
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center backdrop-blur-md">
                <Moon className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h2 className="font-serif-goddess text-2xl sm:text-3xl font-bold tracking-wide text-amber-100">
                  The Goddess Sanctuary
                </h2>
                <p className="text-xs text-pink-200/80">
                  PMDD nervous system regulation & gentle shelter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className={`p-2 rounded-full border transition-all backdrop-blur-md ${
                  isPlayingAudio
                    ? 'bg-amber-400/30 border-amber-300 text-amber-200 shadow-lg shadow-amber-400/20'
                    : 'bg-black/30 border-white/15 text-pink-200 hover:text-white'
                }`}
                title={isPlayingAudio ? 'Mute 432Hz Drone' : 'Play 432Hz Healing Frequency'}
              >
                {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  if (isPlayingAudio) toggleSound();
                  onClose();
                }}
                className="p-2 rounded-full bg-black/30 border border-white/15 text-pink-200 hover:text-white transition-colors backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sacred Validation Note */}
          <div className="my-5 p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-pink-100/90 leading-relaxed font-light">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
              <div className="space-y-1">
                <p>
                  <strong className="font-serif-goddess text-base font-semibold text-amber-200">
                    Queen {userName || 'Esther'}, you are safe here.
                  </strong>
                </p>
                <p>
                  The sudden sadness, heavy limbs, or sensitivity you feel is your body’s nervous system reacting
                  to rapid progesterone shifts. It is neurochemistry, not who you are.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 4-7-8 Breathing Circle with Moon Goddess Atmosphere */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="relative flex items-center justify-center w-48 h-48 sm:w-52 sm:h-52">
              {/* Outer Pulsing Halo */}
              <div
                className={`absolute inset-0 rounded-full border transition-all duration-1000 ${
                  breathState === 'Inhale'
                    ? 'scale-110 border-amber-300/50 bg-amber-400/10'
                    : breathState === 'Hold'
                    ? 'scale-110 border-pink-300/50 bg-pink-400/15'
                    : 'scale-90 border-white/20 bg-black/20'
                }`}
              />
              {/* Glass Inner Core */}
              <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-center shadow-2xl">
                <Wind className="w-5 h-5 text-amber-300 mb-0.5" />
                <span className="font-serif-goddess text-xl sm:text-2xl font-bold text-amber-100 tracking-wider">
                  {breathState}
                </span>
                <span className="text-3xl font-light text-pink-100 tabular-nums">
                  {breathCounter}s
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-pink-200/75 text-center max-w-sm font-light">
              4 seconds in through the nose · 7 seconds holding stillness · 8 seconds slow surrender
            </p>
          </div>

          {/* Direct Action Prescriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => {
                if (onSelectAction) onSelectAction('tea');
                onClose();
              }}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-amber-300/40 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <span className="font-serif-goddess text-sm font-semibold text-amber-100 group-hover:text-amber-200">
                  Brew Hibiscus & Cloves
                </span>
                <p className="text-[11px] text-pink-200/70">Warming uterine balm & bioavailable iron</p>
              </div>
            </button>

            <button
              onClick={() => {
                if (onSelectAction) onSelectAction('stretch');
                onClose();
              }}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-amber-300/40 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center shrink-0">
                <Flower2 className="w-4 h-4 text-pink-200" />
              </div>
              <div>
                <span className="font-serif-goddess text-sm font-semibold text-amber-100 group-hover:text-amber-200">
                  Reclined Butterfly Stretch
                </span>
                <p className="text-[11px] text-pink-200/70">3-minute pelvic opening to drain tension</p>
              </div>
            </button>
          </div>

          {/* Close Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (isPlayingAudio) toggleSound();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-pink-100 hover:text-white font-medium text-xs tracking-wide transition-all shadow-md active:scale-95"
            >
              I Feel Grounded · Return to Sanctuary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
