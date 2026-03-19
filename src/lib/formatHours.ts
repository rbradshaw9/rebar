/**
 * Shared hours formatting utilities.
 * Used by Footer, ReservationsPage, and the GMB API endpoint.
 */

export const DAYS = ['mon','tue','wed','thu','fri','sat','sun'] as const;
export type DayKey = typeof DAYS[number];

/** Converts 24hr "HH:MM" → 12hr "H:MM AM/PM" */
export function fmt24to12(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

/** Returns a display string: "4:00 PM – 10:00 PM" or "Closed" */
export function formatDayHours(open: string, close: string, closed: string): string {
  if (closed === 'true') return 'Closed';
  if (!open || !close) return 'Closed';
  return `${fmt24to12(open)} – ${fmt24to12(close)}`;
}

export interface DayHours {
  open: string;    // "HH:MM" 24hr
  close: string;   // "HH:MM" 24hr
  closed: boolean;
}

/** GMB day name map used by the API endpoint */
export const GMB_DAY: Record<DayKey, string> = {
  mon: 'MONDAY',
  tue: 'TUESDAY',
  wed: 'WEDNESDAY',
  thu: 'THURSDAY',
  fri: 'FRIDAY',
  sat: 'SATURDAY',
  sun: 'SUNDAY',
};

/**
 * Parses a flat settings map (key → value) into a DayHours record.
 * Keys expected: hours_{day}_open, hours_{day}_close, hours_{day}_closed
 */
export function parseHoursFromSettings(
  settings: Record<string, string>
): Record<DayKey, DayHours> {
  const result = {} as Record<DayKey, DayHours>;
  for (const day of DAYS) {
    result[day] = {
      open:   settings[`hours_${day}_open`]   ?? '16:00',
      close:  settings[`hours_${day}_close`]  ?? '22:00',
      closed: settings[`hours_${day}_closed`] === 'true',
    };
  }
  return result;
}
