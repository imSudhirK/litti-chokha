import "server-only";

import { requireUser } from "@/lib/auth";
import {
  addDays,
  dateKeysBetween,
  toDateKey,
  todayKey,
  type DateKey,
} from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import { WINDOW_DAYS, type HabitWithProgress } from "./types";

/**
 * Every active habit with its recent history and streaks.
 *
 * Two queries rather than a join: habits and their entries come back
 * separately and are stitched in memory. At this scale (a handful of habits,
 * ~84 days) that is cheaper to read and to change than SQL window functions,
 * and streak logic stays testable as a plain function.
 */
export async function listHabits(): Promise<HabitWithProgress[]> {
  const user = await requireUser();
  const supabase = await createClient();

  const today = todayKey();
  const windowStart = toDateKey(addDays(new Date(), -(WINDOW_DAYS - 1)));

  const [habitsResult, entriesResult] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("archived", false)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("habit_entries")
      .select("habit_id, entry_date")
      .eq("user_id", user.id)
      .gte("entry_date", windowStart)
      .order("entry_date", { ascending: false }),
  ]);

  if (habitsResult.error) {
    throw new Error(`Failed to load habits: ${habitsResult.error.message}`);
  }
  if (entriesResult.error) {
    throw new Error(
      `Failed to load habit entries: ${entriesResult.error.message}`,
    );
  }

  const byHabit = new Map<string, DateKey[]>();
  for (const entry of entriesResult.data ?? []) {
    const list = byHabit.get(entry.habit_id);
    if (list) list.push(entry.entry_date);
    else byHabit.set(entry.habit_id, [entry.entry_date]);
  }

  return (habitsResult.data ?? []).map((habit) => {
    const entries = byHabit.get(habit.id) ?? [];
    const dates = new Set(entries);
    return {
      ...habit,
      entries,
      doneToday: dates.has(today),
      currentStreak: currentStreak(dates, today),
      longestStreak: longestStreak(dates, windowStart, today),
      completionRate: entries.length / WINDOW_DAYS,
    };
  });
}

/**
 * Consecutive days ending today.
 *
 * Today not being ticked yet doesn't break a streak — it's still in progress —
 * so counting starts at yesterday in that case. Missing *yesterday* does break
 * it, which is what makes the number meaningful.
 */
export function currentStreak(dates: Set<DateKey>, today: DateKey): number {
  let count = 0;
  let cursor = new Date(
    Number(today.slice(0, 4)),
    Number(today.slice(5, 7)) - 1,
    Number(today.slice(8, 10)),
  );

  if (!dates.has(toDateKey(cursor))) cursor = addDays(cursor, -1);

  while (dates.has(toDateKey(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** Longest consecutive run inside the loaded window. */
export function longestStreak(
  dates: Set<DateKey>,
  from: DateKey,
  to: DateKey,
): number {
  let best = 0;
  let run = 0;
  for (const key of dateKeysBetween(from, to)) {
    run = dates.has(key) ? run + 1 : 0;
    if (run > best) best = run;
  }
  return best;
}
