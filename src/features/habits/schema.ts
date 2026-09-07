import { z } from "zod";

/** Palette offered when creating a habit; keys match Tailwind color families. */
export const HABIT_COLORS = [
  "emerald",
  "sky",
  "violet",
  "amber",
  "rose",
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number];

const name = z
  .string()
  .trim()
  .min(1, "Give the habit a name.")
  .max(80, "Keep the name under 80 characters.");

const color = z.enum(HABIT_COLORS).default("emerald");

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.");

export const createHabitSchema = z.object({ name, color });

export const renameHabitSchema = z.object({
  id: z.string().uuid(),
  name,
});

export const toggleEntrySchema = z.object({
  habitId: z.string().uuid(),
  date: dateKey,
  done: z.boolean(),
});

export const deleteHabitSchema = z.object({ id: z.string().uuid() });
