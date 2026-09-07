import "server-only";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { TodoList } from "./types";

/**
 * Every todo for the signed-in user, split into open and completed.
 *
 * The `user_id` filter is belt-and-braces — RLS already restricts the rows —
 * but it keeps the query index-friendly and the intent obvious at the call site.
 */
export async function listTodos(): Promise<TodoList> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("done", { ascending: true })
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load todos: ${error.message}`);

  const todos = data ?? [];
  return {
    open: todos.filter((todo) => !todo.done),
    done: todos.filter((todo) => todo.done),
  };
}
