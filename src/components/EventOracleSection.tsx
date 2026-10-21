import React, { useState } from 'react';
import { CalculatedCycle, CycleConfig, FutureEvent } from '../types';
import { calculateCycle } from '../data/cycles';
import { generateEventIcs, generateCycleIcs, downloadFile, setupReminders } from '../utils/calendar';
import { Calendar, Plus, Download, Bell, Trash2, Clock, Sparkles } from 'lucide-react';

interface EventOracleSectionProps {
  config: CycleConfig;
  cycle: CalculatedCycle;
  events: FutureEvent[];
  onAddEvent: (event: FutureEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventOracleSection: React.FC<EventOracleSectionProps> = ({
  config,
  cycle,
  events,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<FutureEvent['category']>('social');
  const [newNotes, setNewNotes] = useState('');
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const event: FutureEvent = {
      id: `ev-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      category: newCategory,
      notes: newNotes.trim() || undefined,
    };

    onAddEvent(event);
    setNewTitle('');
    setNewDate('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleDownloadCycleCalendar = () => {
    const ics = generateCycleIcs(cycle, config.userName);
    downloadFile(`Attuned-Cycle-Forecast-${config.userName}.ics`, ics);
  };

  const handleDownloadSingleEvent = (event: FutureEvent) => {
    const targetCycle = calculateCycle(config, new Date(event.date + 'T12:00:00'));
    const ics = generateEventIcs(event, targetCycle);
    downloadFile(`Attuned-Event-${event.title.replace(/\s+/g, '-')}.ics`, ics);
  };

  const handleEnableReminders = async () => {
    const res = await setupReminders();
    setReminderStatus(res.message);
    setTimeout(() => setReminderStatus(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#1e0a29]/90 to-rose-950/80 border border-fuchsia-800/40 shadow-xl shadow-purple-950/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-serif-goddess font-semibold uppercase tracking-wider text-amber-200">
                Future Event Oracle & Cycle Foresight
              </span>
            </div>
            <h3 className="font-serif-goddess text-2xl sm:text-3xl font-bold text-pink-100">
              Plan Ahead in Tune with Your Hormonal Seasons
            </h3>
            <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed font-light">
              Never get caught off-guard. Enter upcoming dates (weddings, work presentations, vacations, date nights)
              and Attuned will project your exact cycle phase and energy level so you can dress, pace, and prepare with sovereign poise.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadCycleCalendar}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white text-xs font-medium flex items-center gap-2 shadow-md shadow-pink-950/50"
              title="Add period milestones and reminders to Google Calendar / Apple Calendar"
            >
              <Download className="w-3.5 h-3.5 text-amber-200" />
              <span>Export Bleed Milestones (.ics)</span>
            </button>

            <button
              onClick={handleEnableReminders}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink-200 text-xs font-medium flex items-center gap-2"
              title="Turn on browser notification reminders"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Enable Notifications</span>
            </button>
          </div>
        </div>

        {reminderStatus && (
          <p className="mt-3 text-xs text-amber-300 font-mono italic animate-pulse">
            {reminderStatus}
          </p>
        )}
      </div>

      {/* Action Bar & Add Form */}
      <div className="flex items-center justify-between">
        <h4 className="font-serif-goddess text-xl font-bold text-pink-100">
          Your Sacred Schedule & Projections ({events.length})
        </h4>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-rose-950/40"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Future Event</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 sm:p-6 rounded-3xl bg-fuchsia-950/40 border border-amber-500/30 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-serif-goddess font-semibold text-pink-200 mb-1">
                Event Title
              </label>
              <input
                type="text"
                placeholder="e.g., Weekend Beach Trip or Client Pitch"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#120718] border border-fuchsia-700/40 rounded-xl px-3 py-2 text-xs text-pink-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-serif-goddess font-semibold text-pink-200 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-[#120718] border border-fuchsia-700/40 rounded-xl px-3 py-2 text-xs text-pink-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-serif-goddess font-semibold text-pink-200 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as FutureEvent['category'])}
                className="w-full bg-[#120718] border border-fuchsia-700/40 rounded-xl px-3 py-2 text-xs text-pink-100 focus:outline-none focus:border-amber-400"
              >
                <option value="social">Social Gathering</option>
                <option value="career">Career & Presentations</option>
                <option value="travel">Travel & Retreat</option>
                <option value="date">Date Night</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif-goddess font-semibold text-pink-200 mb-1">
              Personal Intentions & Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Pack comfortable clothes, schedule afternoon nap..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full bg-[#120718] border border-fuchsia-700/40 rounded-xl px-3 py-2 text-xs text-pink-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-pink-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs font-medium shadow-md shadow-rose-950/40"
            >
              Save & Project Cycle
            </button>
          </div>
        </form>
      )}

      {/* Events List with Projections */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-3xl bg-fuchsia-950/20 border border-fuchsia-900/30 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-300/60 mx-auto" />
            <p className="font-serif-goddess text-lg text-pink-200">No upcoming events logged yet</p>
            <p className="text-xs text-pink-400/70 max-w-sm mx-auto">
              Add your vacations, parties, or important meetings to see what phase of your cycle you’ll be in.
            </p>
          </div>
        ) : (
          events.map((ev) => {
            const projected = calculateCycle(config, new Date(ev.date + 'T12:00:00'));
            const dateObj = new Date(ev.date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={ev.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#1a0824]/80 border border-fuchsia-800/30 hover:border-amber-400/40 transition-all shadow-md shadow-purple-950/30 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        {formattedDate}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-pink-400/80">
                        {ev.category}
                      </span>
                    </div>
                    <h4 className="font-serif-goddess text-xl font-bold text-pink-100 mt-1">
                      {ev.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadSingleEvent(ev)}
                      className="py-1.5 px-3 rounded-lg bg-fuchsia-950/60 hover:bg-fuchsia-900/60 border border-fuchsia-700/30 text-xs text-pink-200 hover:text-amber-200 flex items-center gap-1.5 transition-colors"
                      title="Sync this event with cycle advice to your calendar"
                    >
                      <Download className="w-3 h-3 text-amber-300" />
                      <span>Sync to Calendar</span>
                    </button>
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-pink-400 hover:text-rose-400 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Projected Cycle Foresight */}
                <div className="p-3.5 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-800/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-amber-200 font-semibold font-serif-goddess">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        Projected: Day {projected.currentCycleDay} · {projected.phaseDetails.name} (
                        {projected.phaseDetails.season})
                      </span>
                    </div>
                    <p className="text-pink-300/80 text-[11px] font-light">
                      Energy: <strong className="text-pink-100">{projected.phaseDetails.energyLevel}</strong> ·{' '}
                      {projected.phaseDetails.selfCareFocus}
                    </p>
                  </div>
                </div>

                {ev.notes && (
                  <p className="text-xs text-pink-300/70 italic">
                    Notes: {ev.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
