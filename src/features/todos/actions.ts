"use server";

import { revalidatePath } from "next/cache";

import { fail, fromZodError, ok, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  createTodoSchema,
  deleteTodoSchema,
  toggleTodoSchema,
  updateTodoSchema,
} from "./schema";

const PATH = "/todos";

/**
 * Mutations for the todos feature.
 *
 * Each one: authenticate → validate → write scoped to the user → revalidate.
 * The `.eq("user_id", …)` on writes matters — RLS would block a cross-user
 * write anyway, but this makes it a no-op rather than an error and keeps the
 * ownership rule visible in the code.
 */

export async function createTodo(
  formData: FormData,
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = createTodoSchema.safeParse({
    title: formData.get("title"),
    notes: formData.get("notes") ?? undefined,
    due_date: formData.get("due_date") ?? undefined,
  });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.from("todos").insert({
    user_id: user.id,
    title: parsed.data.title,
    notes: parsed.data.notes,
    due_date: parsed.data.due_date,
    // New todos sort to the top of the open list.
    position: -Date.now(),
  });

  if (error) return fail("Couldn't save that todo. Please try again.");

  revalidatePath(PATH);
  return ok();
}

export async function updateTodo(
  formData: FormData,
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = updateTodoSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    notes: formData.get("notes") ?? undefined,
    due_date: formData.get("due_date") ?? undefined,
  });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({
      title: parsed.data.title,
      notes: parsed.data.notes,
      due_date: parsed.data.due_date,
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return fail("Couldn't update that todo. Please try again.");

  revalidatePath(PATH);
  return ok();
}

export async function toggleTodo(
  id: string,
  done: boolean,
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = toggleTodoSchema.safeParse({ id, done });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ done: parsed.data.done })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return fail("Couldn't update that todo. Please try again.");

  revalidatePath(PATH);
  return ok();
}

export async function deleteTodo(id: string): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = deleteTodoSchema.safeParse({ id });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return fail("Couldn't delete that todo. Please try again.");

  revalidatePath(PATH);
  return ok();
}
