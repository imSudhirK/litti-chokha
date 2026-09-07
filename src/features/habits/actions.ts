"use server";

import { revalidatePath } from "next/cache";

import { fail, fromZodError, ok, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  createHabitSchema,
  deleteHabitSchema,
  renameHabitSchema,
  toggleEntrySchema,
} from "./schema";

const PATH = "/habits";

export async function createHabit(
  formData: FormData,
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = createHabitSchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color") ?? undefined,
  });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name: parsed.data.name,
    color: parsed.data.color,
    position: Date.now(),
  });

  if (error) return fail("Couldn't create that habit. Please try again.");

  revalidatePath(PATH);
  return ok();
}

export async function renameHabit(
  formData: FormData,
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = renameHabitSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase
    .from("habits")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return fail("Couldn't rename that habit. Please try again.");

  revalidatePath(PATH);
  return ok();
}

/**
 * Marks a day done or not done.
 *
 * A row's existence *is* the state, so this inserts or deletes rather than
 * updating. The insert is an upsert on (habit_id, entry_date) so a double-click
 * — or two tabs — settles as "done" instead of a unique-violation error.
 */
export async function toggleHabitEntry(
  habitId: string,
  date: string,
  done: boolean,
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = toggleEntrySchema.safeParse({ habitId, date, done });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();

  const { error } = parsed.data.done
    ? await supabase.from("habit_entries").upsert(
        {
          habit_id: parsed.data.habitId,
          user_id: user.id,
          entry_date: parsed.data.date,
        },
        { onConflict: "habit_id,entry_date", ignoreDuplicates: true },
      )
    : await supabase
        .from("habit_entries")
        .delete()
        .eq("habit_id", parsed.data.habitId)
        .eq("entry_date", parsed.data.date)
        .eq("user_id", user.id);

  if (error) return fail("Couldn't record that. Please try again.");

  revalidatePath(PATH);
  return ok();
}

export async function deleteHabit(id: string): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = deleteHabitSchema.safeParse({ id });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  // Entries cascade with the habit (see 0003_habits.sql).
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return fail("Couldn't delete that habit. Please try again.");

  revalidatePath(PATH);
  return ok();
}
