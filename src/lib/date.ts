/**
 * Date helpers for calendar-day work.
 *
 * Habit entries are calendar days, not instants, so everything here works on
 * `YYYY-MM-DD` strings and deliberately avoids UTC conversion — `toISOString()`
 * would roll a late-evening check-in into tomorrow for anyone east of UTC.
 */

export type DateKey = string; // YYYY-MM-DD

export function toDateKey(date: Date): DateKey {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(key: DateKey): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

/** Calendar days from `key` back to today, oldest first. */
export function dateKeysBetween(from: DateKey, to: DateKey): DateKey[] {
  const keys: DateKey[] = [];
  const end = fromDateKey(to);
  for (let d = fromDateKey(from); d <= end; d = addDays(d, 1)) {
    keys.push(toDateKey(d));
  }
  return keys;
}

/** e.g. "Mar 4" — used for tooltips and due dates. */
export function formatShortDate(key: DateKey): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
