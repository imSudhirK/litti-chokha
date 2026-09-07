import { z } from "zod";

/**
 * Input contracts for the todos feature. Actions parse against these before
 * touching the database, so the constraints here mirror 0002_todos.sql.
 */

const title = z
  .string()
  .trim()
  .min(1, "Give the todo a title.")
  .max(200, "Keep the title under 200 characters.");

const notes = z
  .string()
  .trim()
  .max(2000, "Notes are limited to 2000 characters.")
  .optional()
  .transform((value) => (value ? value : null));

const dueDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : null));

export const createTodoSchema = z.object({ title, notes, due_date: dueDate });

export const updateTodoSchema = z.object({
  id: z.string().uuid(),
  title,
  notes,
  due_date: dueDate,
});

export const toggleTodoSchema = z.object({
  id: z.string().uuid(),
  done: z.boolean(),
});

export const deleteTodoSchema = z.object({ id: z.string().uuid() });

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
