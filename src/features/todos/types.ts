import type { Tables } from "@/lib/db.types";

/**
 * Types shared by the server and client halves of this feature.
 *
 * Kept out of queries.ts, which is `server-only`: a client component that
 * imports a *value* from there would drag the Supabase server client into the
 * browser bundle and fail the build.
 */

export type Todo = Tables<"todos">;

export type TodoList = {
  open: Todo[];
  done: Todo[];
};
