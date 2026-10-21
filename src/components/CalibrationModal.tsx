import React, { useState } from 'react';
import { CycleConfig } from '../types';
import { Calendar, User, Clock, Bell, X, Check, Sparkles } from 'lucide-react';
import { setupReminders } from '../utils/calendar';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CycleConfig;
  onSave: (newConfig: CycleConfig) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<CycleConfig>(config);
  const [savedToast, setSavedToast] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  const handleTestNotification = async () => {
    const res = await setupReminders();
    setNotificationMsg(res.message);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#220d2e] via-[#180922] to-[#100517] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 text-pink-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-fuchsia-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h2 className="font-serif-goddess text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-fuchsia-200">
                Cycle & Sanctuary Calibration
              </h2>
              <p className="text-xs text-pink-300/70">
                Personalize your sacred cycle dates and daily goddess reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-pink-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 mt-6">
          {/* Queen Name & Avatar Preview */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-fuchsia-950/50 border border-fuchsia-800/30">
            <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-pink-400 to-fuchsia-500 shrink-0">
              <img
                src={formData.userAvatar}
                alt={formData.userName}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-serif-goddess font-semibold text-pink-200 mb-1">
                Goddess Name / Title
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-pink-400/60" />
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Queen Esther"
                  className="w-full bg-[#120718] border border-fuchsia-700/40 rounded-xl pl-9 pr-3 py-2 text-xs text-pink-100 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* First Day of Last Period */}
          <div className="p-4 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-800/30 space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-serif-goddess font-semibold text-pink-200">
              <Calendar className="w-4 h-4 text-amber-300" />
              First Day of Last Period
            </label>
            <p className="text-[11px] text-pink-300/70">
              The first day your sacred bleed began this cycle.
            </p>
            <input
              type="date"
              value={formData.lastPeriodDate}
              onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
              className="w-full bg-[#120718] border border-fuchsia-700/40 rounded-xl px-3.5 py-2 text-xs text-pink-100 focus:outline-none focus:border-amber-400 transition-colors mt-2"
              required
            />
          </div>

          {/* Average Cycle Length */}
          <div className="p-4 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-serif-goddess font-semibold text-pink-200">
                <Clock className="w-4 h-4 text-pink-400" />
                Average Cycle Length
              </label>
              <span className="text-xs font-semibold text-amber-300 font-mono tabular-nums px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                {formData.cycleLength} Days
              </span>
            </div>
            <p className="text-[11px] text-pink-300/70">
              From day 1 of one period to day 1 of the next (typically 28 days).
            </p>
            <input
              type="range"
              min="21"
              max="40"
              value={formData.cycleLength}
              onChange={(e) => setFormData({ ...formData, cycleLength: parseInt(e.target.value) || 28 })}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-pink-400/60 font-mono">
              <span>21 Days</span>
              <span>28 Days (Standard)</span>
              <span>40 Days</span>
            </div>
          </div>

          {/* Period Bleed Duration */}
          <div className="p-4 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-serif-goddess font-semibold text-pink-200">
                <Sparkles className="w-4 h-4 text-rose-400" />
                Bleed Duration
              </label>
              <span className="text-xs font-semibold text-rose-300 font-mono tabular-nums px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30">
                {formData.periodDuration} Days
              </span>
            </div>
            <p className="text-[11px] text-pink-300/70">
              How many days your bleeding usually lasts.
            </p>
            <input
              type="range"
              min="3"
              max="9"
              value={formData.periodDuration}
              onChange={(e) => setFormData({ ...formData, periodDuration: parseInt(e.target.value) || 5 })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Evening Walk & Affirmation Reminders */}
          <div className="p-4 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-serif-goddess font-semibold text-pink-200">
                  <Bell className="w-4 h-4 text-amber-300" />
                  Evening Walk & Affirmation Alert
                </span>
                <p className="text-[11px] text-pink-300/70">
                  Gentle alert for golden hour walks & evening hip openers
                </p>
              </div>
              <input
                type="time"
                value={formData.dailyReminderTime}
                onChange={(e) => setFormData({ ...formData, dailyReminderTime: e.target.value })}
                className="bg-[#120718] border border-fuchsia-700/40 rounded-xl px-2.5 py-1 text-xs text-amber-200 font-mono focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleTestNotification}
              className="w-full py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-medium transition-colors"
            >
              Test Daily Sacred Reminders on this Device
            </button>
            {notificationMsg && (
              <p className="text-[11px] text-amber-300/90 italic text-center animate-pulse">
                {notificationMsg}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-pink-200 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-pink-600 to-fuchsia-600 hover:from-amber-500 hover:to-fuchsia-500 text-white font-medium text-xs tracking-wide transition-all shadow-lg shadow-pink-950/50 flex items-center justify-center gap-2"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Sanctuary Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Save Sacred Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
