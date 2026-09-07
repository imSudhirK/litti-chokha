import type { Tables } from "@/lib/db.types";
import type { DateKey } from "@/lib/date";

/**
 * Types and constants shared by the server and client halves of this feature.
 *
 * They live here rather than in queries.ts because that module is `server-only`
 * — importing a value from it in a client component drags the Supabase server
 * client into the browser bundle and fails the build.
 */

/** Days of history shown in the heatmap (12 weeks). */
export const WINDOW_DAYS = 84;

export type Habit = Tables<"habits">;

export type HabitWithProgress = Habit & {
  /** Entry dates inside the window, most recent first. */
  entries: DateKey[];
  doneToday: boolean;
  currentStreak: number;
  longestStreak: number;
  /** Completions in the window, as a 0–1 fraction of its days. */
  completionRate: number;
};
