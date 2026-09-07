import type { HabitColor } from "../schema";

/**
 * Class names must appear as complete literal strings for Tailwind's scanner
 * to emit them, so the palette is a static map rather than interpolated
 * `bg-${color}-500` strings.
 */
export const HABIT_COLOR_CLASSES: Record<
  HabitColor,
  { dot: string; filled: string; ring: string }
> = {
  emerald: {
    dot: "bg-emerald-500",
    filled: "bg-emerald-500 hover:bg-emerald-600",
    ring: "focus-visible:outline-emerald-500",
  },
  sky: {
    dot: "bg-sky-500",
    filled: "bg-sky-500 hover:bg-sky-600",
    ring: "focus-visible:outline-sky-500",
  },
  violet: {
    dot: "bg-violet-500",
    filled: "bg-violet-500 hover:bg-violet-600",
    ring: "focus-visible:outline-violet-500",
  },
  amber: {
    dot: "bg-amber-500",
    filled: "bg-amber-500 hover:bg-amber-600",
    ring: "focus-visible:outline-amber-500",
  },
  rose: {
    dot: "bg-rose-500",
    filled: "bg-rose-500 hover:bg-rose-600",
    ring: "focus-visible:outline-rose-500",
  },
};

/** Falls back to emerald if the stored color predates the current palette. */
export function colorClasses(color: string) {
  return (
    HABIT_COLOR_CLASSES[color as HabitColor] ?? HABIT_COLOR_CLASSES.emerald
  );
}
