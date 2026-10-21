import React, { useState, useEffect } from 'react';
import { CycleConfig, MoodCheckin, FutureEvent } from './types';
import { DEFAULT_CONFIG, calculateCycle, INITIAL_EVENTS } from './data/cycles';
import { TopBar } from './components/TopBar';
import { CycleDial } from './components/CycleDial';
import { GoddessAffirmation } from './components/GoddessAffirmation';
import { MoodCompass } from './components/MoodCompass';
import { MovementSection } from './components/MovementSection';
import { ApothecarySection } from './components/ApothecarySection';
import { EventOracleSection } from './components/EventOracleSection';
import { GoddessAltarCard } from './components/GoddessAltarCard';
import { SanctuaryModal } from './components/SanctuaryModal';
import { CalibrationModal } from './components/CalibrationModal';
import { Droplets, Sparkles, Heart } from 'lucide-react';

const STORAGE_KEY_CONFIG = 'attuned_goddess_config_v1';
const STORAGE_KEY_CHECKINS = 'attuned_goddess_checkins_v1';
const STORAGE_KEY_EVENTS = 'attuned_goddess_events_v1';

export default function App() {
  // Load initial configuration from localStorage
  const [config, setConfig] = useState<CycleConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return DEFAULT_CONFIG;
  });

  // Recent checkins
  const [checkins, setCheckins] = useState<MoodCheckin[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHECKINS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return [];
  });

  // Events
  const [events, setEvents] = useState<FutureEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return INITIAL_EVENTS;
  });

  const [currentTab, setCurrentTab] = useState<string>('sanctuary');
  const [isSanctuaryOpen, setIsSanctuaryOpen] = useState<boolean>(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState<boolean>(false);
  const [periodLoggedToast, setPeriodLoggedToast] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(checkins));
    } catch {}
  }, [checkins]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch {}
  }, [events]);

  // Calculate current cycle metrics
  const cycle = calculateCycle(config, new Date());

  // Handler for 1-tap period started today
  const handlePeriodStartedToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setConfig((prev) => ({
      ...prev,
      lastPeriodDate: todayStr,
    }));
    setPeriodLoggedToast(true);
    setTimeout(() => setPeriodLoggedToast(false), 4000);
  };

  const handleSaveConfig = (newConfig: CycleConfig) => {
    setConfig(newConfig);
  };

  const handleLogCheckin = (checkin: MoodCheckin) => {
    setCheckins((prev) => [checkin, ...prev]);
  };

  const handleAddEvent = (event: FutureEvent) => {
    setEvents((prev) => [event, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0512] text-[#fdf2f8] flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Ambient warm sunset & dusk glows */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-amber-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-500/6 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar Navigation */}
      <TopBar
        config={config}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
        onOpenSanctuary={() => setIsSanctuaryOpen(true)}
      />

      {/* Period Logged Notification Toast */}
      {periodLoggedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-rose-900 to-fuchsia-950 border border-rose-500/50 shadow-2xl shadow-rose-950/80 flex items-center gap-3 animate-fade-in text-xs text-white max-w-sm">
          <Droplets className="w-5 h-5 text-pink-300 animate-bounce" />
          <div>
            <p className="font-serif-goddess font-bold text-sm text-amber-200">
              Sacred Bleed Logged Today
            </p>
            <p className="text-[11px] text-pink-200/80">
              Welcome to Day 1, Queen {config.userName}. Recalibrated your cycle to Inner Winter rest.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 relative z-10">
        {/* Personal Goddess Altar Card with Esther Portrait */}
        <GoddessAltarCard
          cycle={cycle}
          config={config}
          onOpenSanctuary={() => setIsSanctuaryOpen(true)}
          onOpenCalibration={() => setIsCalibrationOpen(true)}
          onNavigateTab={setCurrentTab}
        />

        {/* TAB 1: SANCTUARY (CYCLE DIAL, AFFIRMATION & MOOD COMPASS) */}
        {currentTab === 'sanctuary' && (
          <div className="space-y-8">
            {/* Cycle Dial & Prediction */}
            <CycleDial
              cycle={cycle}
              userName={config.userName}
              onPeriodStartedToday={handlePeriodStartedToday}
              onOpenCalibration={() => setIsCalibrationOpen(true)}
            />

            {/* Daily Affirmation Card */}
            <GoddessAffirmation cycle={cycle} userName={config.userName} />

            {/* Daily Mood & PMDD Compass */}
            <MoodCompass
              cycle={cycle}
              userName={config.userName}
              onLogCheckin={handleLogCheckin}
              recentCheckins={checkins}
              onOpenSanctuary={() => setIsSanctuaryOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: MOVEMENT & STRETCHES */}
        {currentTab === 'movement' && (
          <MovementSection cycle={cycle} userName={config.userName} />
        )}

        {/* TAB 3: APOTHECARY & GLOW */}
        {currentTab === 'apothecary' && (
          <ApothecarySection cycle={cycle} userName={config.userName} />
        )}

        {/* TAB 4: EVENT ORACLE & CALENDAR */}
        {currentTab === 'oracle' && (
          <EventOracleSection
            config={config}
            cycle={cycle}
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
      </main>

      {/* Modals */}
      <SanctuaryModal
        isOpen={isSanctuaryOpen}
        onClose={() => setIsSanctuaryOpen(false)}
        cycle={cycle}
        userName={config.userName}
        onSelectAction={(action) => {
          if (action === 'tea') setCurrentTab('apothecary');
          if (action === 'stretch') setCurrentTab('movement');
        }}
      />

      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />

      {/* Subtle Footer */}
      <footer className="mt-auto border-t border-fuchsia-900/20 py-6 text-center text-xs text-pink-300/60 font-light">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300/80" />
          <span className="font-serif-goddess font-semibold text-pink-200">Attuned</span>
          <span aria-hidden="true">·</span>
          <span>In Sacred Harmony with Queen {config.userName || 'Esther'}</span>
        </div>
        <p className="text-[10px] text-pink-400/40">
          Rooted in bodily intuition, African royalty, and radical self-compassion · Works 100% offline
        </p>
      </footer>
    </div>
  );
}
