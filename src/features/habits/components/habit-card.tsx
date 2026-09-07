"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { todayKey } from "@/lib/date";
import { deleteHabit, toggleHabitEntry } from "../actions";
import type { HabitWithProgress } from "../types";
import { colorClasses } from "./colors";
import { HabitHeatmap } from "./habit-heatmap";

export function HabitCard({ habit }: { habit: HabitWithProgress }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const classes = colorClasses(habit.color);

  function toggleToday() {
    startTransition(async () => {
      const result = await toggleHabitEntry(
        habit.id,
        todayKey(),
        !habit.doneToday,
      );
      setError(result.ok ? null : result.error);
    });
  }

  function remove() {
    if (!window.confirm(`Delete "${habit.name}" and all its history?`)) return;
    startTransition(async () => {
      const result = await deleteHabit(habit.id);
      setError(result.ok ? null : result.error);
    });
  }

  return (
    <article
      className={cn(
        "space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900",
        pending && "opacity-70",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", classes.dot)}
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {habit.name}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {habit.currentStreak} day streak · best {habit.longestStreak} ·{" "}
            {Math.round(habit.completionRate * 100)}% over 12 weeks
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          variant={habit.doneToday ? "secondary" : "primary"}
          onClick={toggleToday}
          disabled={pending}
          className="shrink-0"
        >
          {habit.doneToday ? "Done today ✓" : "Mark today"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="danger"
          onClick={remove}
          disabled={pending}
          className="shrink-0"
        >
          Delete
        </Button>
      </div>

      <HabitHeatmap
        habitId={habit.id}
        color={habit.color}
        entries={habit.entries}
        onError={setError}
      />

      {error ? (
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </article>
  );
}
