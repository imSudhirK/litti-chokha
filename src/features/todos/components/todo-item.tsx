"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { formatShortDate, todayKey } from "@/lib/date";
import { deleteTodo, toggleTodo, updateTodo } from "../actions";
import type { Todo } from "../types";

export function TodoItem({ todo }: { todo: Todo }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(work: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await work();
      setError(result.ok ? null : (result.error ?? "Something went wrong."));
      if (result.ok) setEditing(false);
    });
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <form
          action={(formData) => run(() => updateTodo(formData))}
          className="space-y-2"
        >
          <input type="hidden" name="id" value={todo.id} />
          <Input
            name="title"
            defaultValue={todo.title}
            aria-label="Title"
            maxLength={200}
            required
            autoFocus
          />
          <Input
            type="date"
            name="due_date"
            defaultValue={todo.due_date ?? ""}
            aria-label="Due date"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
          {error ? (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          ) : null}
        </form>
      </li>
    );
  }

  const overdue =
    !todo.done && todo.due_date !== null && todo.due_date < todayKey();

  return (
    <li
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900",
        pending && "opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={todo.done}
        disabled={pending}
        aria-label={`Mark "${todo.title}" as ${todo.done ? "not done" : "done"}`}
        onChange={(event) =>
          run(() => toggleTodo(todo.id, event.target.checked))
        }
        className="size-4 shrink-0 accent-slate-900 dark:accent-slate-100"
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            todo.done
              ? "text-slate-400 line-through dark:text-slate-500"
              : "text-slate-900 dark:text-slate-100",
          )}
        >
          {todo.title}
        </p>
        {todo.due_date ? (
          <p
            className={cn(
              "text-xs",
              overdue
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-500 dark:text-slate-400",
            )}
          >
            {overdue ? "Overdue · " : "Due "}
            {formatShortDate(todo.due_date)}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-xs text-rose-600">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setEditing(true)}
          disabled={pending}
        >
          Edit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="danger"
          onClick={() => run(() => deleteTodo(todo.id))}
          disabled={pending}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
