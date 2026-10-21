import { CalculatedCycle, FutureEvent } from '../types';

/**
 * Generates an iCalendar (.ics) string for upcoming cycle milestones
 */
export function generateCycleIcs(cycle: CalculatedCycle, userName: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Format date as YYYYMMDD
  const formatDate = (dateStr: string) => {
    return dateStr.replace(/-/g, '');
  };

  const periodStartDate = formatDate(cycle.nextPeriodDate);

  // 3 days prior reminder
  const threeDaysPrior = new Date(cycle.nextPeriodDate);
  threeDaysPrior.setDate(threeDaysPrior.getDate() - 3);
  const reminderDate = formatDate(threeDaysPrior.toISOString().split('T')[0]);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Attuned//Goddess Cycle Sanctuary//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:attuned-bleed-${Date.now()}@attuned.app`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${periodStartDate}`,
    `SUMMARY:🌸 Attuned: Sacred Bleed Begins (${userName})`,
    'DESCRIPTION:Your menstrual bleed is predicted to begin today. Honor your body, soften expectations, and brew warm hibiscus & clove elixir.',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT12H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Attuned Reminder: Bleed expected tomorrow',
    'END:VALARM',
    'END:VEVENT',
    'BEGIN:VEVENT',
    `UID:attuned-heads-up-${Date.now()}@attuned.app`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${reminderDate}`,
    'SUMMARY:🌙 Attuned: 3-Day Bleed Heads-Up',
    'DESCRIPTION:Your bleed arrives in 3 days. Premenstrual sensitivity is natural right now. Take time for evening hip openers and restorative rest.',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Generates an .ics event for a future event with cycle foresight
 */
export function generateEventIcs(event: FutureEvent, cycleAtDate: CalculatedCycle): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const eventDate = event.date.replace(/-/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Attuned//Goddess Cycle Sanctuary//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:attuned-event-${event.id}@attuned.app`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${eventDate}`,
    `SUMMARY:✨ ${event.title}`,
    `DESCRIPTION:${event.notes || ''}\\n\\n[Attuned Cycle Foresight]\\nOn this date you will be on Day ${cycleAtDate.currentCycleDay} (${cycleAtDate.phaseDetails.name} - ${cycleAtDate.phaseDetails.season}).\\nEnergy Level: ${cycleAtDate.phaseDetails.energyLevel}.\\nSelf-Care Tip: ${cycleAtDate.phaseDetails.selfCareFocus}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Tomorrow: ${event.title} (${cycleAtDate.phaseDetails.name})`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Downloads a file to user device
 */
export function downloadFile(filename: string, content: string, mimeType = 'text/calendar;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Requests browser notification permission and sends test notification
 */
export async function setupReminders(): Promise<{ granted: boolean; message: string }> {
  if (!('Notification' in window)) {
    return { granted: false, message: 'Browser notifications are not supported on this device.' };
  }

  let permission = Notification.permission;
  if (permission !== 'granted' && permission !== 'denied') {
    permission = await Notification.requestPermission();
  }

  if (permission === 'granted') {
    try {
      new Notification('👑 Attuned Sanctuary Active', {
        body: 'Goddess reminders are tuned. We will gently remind you of sunset walks and cycle shifts.',
        icon: '/assets/aistudio/brown_skin_girl_b8282b0e.jpg',
      });
      return { granted: true, message: 'Sacred notifications enabled successfully!' };
    } catch {
      return { granted: true, message: 'Notifications enabled!' };
    }
  }

  return {
    granted: false,
    message: 'Notification permission was not granted. You can still download calendar reminders (.ics).',
  };
}
