import type { ZodError } from "zod";

/**
 * The single return shape for every server action in the app.
 *
 * Actions never throw for expected failures (invalid input, a row that isn't
 * yours) — they return `{ ok: false, error }` so forms can render the message.
 * Unexpected failures are still allowed to throw and hit the error boundary.
 */
export type ActionResult<T = void> =
  { ok: true; data: T } | { ok: false; error: string };

export function ok(): ActionResult<void>;
export function ok<T>(data: T): ActionResult<T>;
export function ok<T>(data?: T): ActionResult<T | void> {
  return { ok: true, data: data as T };
}

export function fail(error: string): ActionResult<never> {
  return { ok: false, error };
}

/** Turns a zod failure into one readable sentence for the form. */
export function fromZodError(error: ZodError): ActionResult<never> {
  return fail(error.issues[0]?.message ?? "That input isn't valid.");
}
