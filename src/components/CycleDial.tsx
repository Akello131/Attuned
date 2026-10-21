import React from 'react';
import { CalculatedCycle } from '../types';
import { Calendar, Droplets, Sparkles, Download, Info } from 'lucide-react';
import { generateCycleIcs, downloadFile } from '../utils/calendar';

interface CycleDialProps {
  cycle: CalculatedCycle;
  userName: string;
  onPeriodStartedToday: () => void;
  onOpenCalibration: () => void;
}

export const CycleDial: React.FC<CycleDialProps> = ({
  cycle,
  userName,
  onPeriodStartedToday,
  onOpenCalibration,
}) => {
  const size = 300;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Fraction for current day
  const currentRatio = cycle.currentCycleDay / cycle.totalCycleDays;
  const strokeDashoffset = circumference - currentRatio * circumference;

  // Angle in degrees for current day bead
  const angleDeg = currentRatio * 360 - 90; // starting from top (12 o'clock)
  const angleRad = (angleDeg * Math.PI) / 180;
  const beadX = center + radius * Math.cos(angleRad);
  const beadY = center + radius * Math.sin(angleRad);

  const handleDownloadIcs = () => {
    const icsData = generateCycleIcs(cycle, userName);
    downloadFile(`Attuned-Cycle-Forecast-${cycle.nextPeriodDate}.ics`, icsData);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-300/20 bg-[#150a1d]/90 backdrop-blur-xl shadow-2xl shadow-black/70">
      {/* Background artwork: Purple Ocean Sunset with measured dreamy scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/aistudio/Purple_sunset______ai_295e6a01.jpg"
          alt="Purple Sunset Beach"
          className="w-full h-full object-cover object-bottom filter brightness-50 contrast-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120718]/95 via-[#120718]/85 to-[#120718]/60" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: The Circular Celestial Dial */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90 filter drop-shadow-[0_0_20px_rgba(251,191,36,0.15)]"
          >
            {/* Background Track with subtle quadrants */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Glowing Active Progress Arc */}
            <defs>
              <linearGradient id="goddessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="35%" stopColor="#ec4899" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#goddessGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Glowing Current Day Marker Bead */}
          <div
            className="absolute w-5 h-5 rounded-full bg-amber-300 border-2 border-[#120718] shadow-lg shadow-amber-400/80 transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${beadX}px`, top: `${beadY}px` }}
          >
            <div className="w-full h-full rounded-full bg-white animate-ping opacity-60" />
          </div>

          {/* Center Inner Sanctuary Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-amber-200/90 font-medium">
              Cycle Day
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="font-serif-goddess text-5xl sm:text-6xl font-bold tracking-tight text-white tabular-nums">
                {cycle.currentCycleDay}
              </span>
              <span className="text-sm font-medium text-pink-200/70 font-mono">
                /{cycle.totalCycleDays}
              </span>
            </div>
            <span className="text-xs font-serif-goddess font-semibold text-amber-100 px-3 py-0.5 rounded-full bg-black/40 border border-amber-300/30 max-w-[170px] truncate backdrop-blur-md">
              {cycle.phaseDetails.name}
            </span>
            <span className="text-[10px] text-pink-100/80 mt-1 max-w-[150px] leading-tight">
              {cycle.phaseDetails.season}
            </span>
          </div>
        </div>

        {/* Right: Insight & Quick Goddess Controls */}
        <div className="flex-1 space-y-4 w-full">
          {/* Top Pill / Headline */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 shadow-sm" />
                <h3 className="font-serif-goddess text-xl sm:text-2xl font-bold text-amber-100">
                  {cycle.phaseDetails.season}
                </h3>
              </div>
              <p className="text-xs text-pink-100/85 mt-0.5 font-light">
                {cycle.phaseDetails.tagline}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-amber-200/80 font-medium">
                Next Bleed Countdown
              </span>
              <p className="font-serif-goddess text-lg sm:text-xl font-bold text-amber-200">
                {cycle.daysUntilNextPeriod === 1
                  ? 'Tomorrow'
                  : `In ${cycle.daysUntilNextPeriod} Days`}
              </p>
              <p className="text-[10px] text-pink-200/70 font-mono">
                {new Date(cycle.nextPeriodDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Biological & Hormonal Insight */}
          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-amber-200">
              <span className="flex items-center gap-1.5 font-serif-goddess">
                <Info className="w-3.5 h-3.5 text-amber-300" />
                Hormonal Landscape
              </span>
              <span className="text-pink-200 text-[11px] font-mono">
                Energy: {cycle.phaseDetails.energyLevel}
              </span>
            </div>
            <p className="text-xs text-pink-100/90 leading-relaxed font-light">
              {cycle.phaseDetails.hormones}
            </p>
            <div className="pt-1.5 flex items-center gap-2 text-[11px] text-pink-200/80 border-t border-white/10">
              <span className="text-amber-200 font-medium font-serif-goddess">Self-Care Focus:</span>
              <span className="truncate">{cycle.phaseDetails.selfCareFocus}</span>
            </div>
          </div>

          {/* 1-Tap Period Logger & Calendar Export */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={onPeriodStartedToday}
              className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-medium text-xs tracking-wide transition-all shadow-lg shadow-black/40 flex items-center justify-center gap-2 active:scale-95 border border-white/10"
            >
              <Droplets className="w-3.5 h-3.5 text-pink-100 animate-bounce" />
              <span>My Period Started Today</span>
            </button>

            <button
              onClick={handleDownloadIcs}
              className="py-2.5 px-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-pink-100 hover:text-amber-200 font-medium text-xs transition-colors flex items-center justify-center gap-2 shrink-0 backdrop-blur-md"
              title="Add cycle milestones & reminders to Google Calendar or Apple Calendar (.ics)"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Calendar Sync (.ics)</span>
            </button>

            <button
              onClick={onOpenCalibration}
              className="py-2.5 px-3 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 text-pink-200 text-xs font-medium transition-colors shrink-0 backdrop-blur-md"
              title="Adjust cycle duration or start date"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
