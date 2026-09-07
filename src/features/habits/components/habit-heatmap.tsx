"use client";

import { useTransition } from "react";

import { cn } from "@/lib/cn";
import {
  addDays,
  formatShortDate,
  toDateKey,
  todayKey,
  type DateKey,
} from "@/lib/date";
import { toggleHabitEntry } from "../actions";
import { WINDOW_DAYS } from "../types";
import { colorClasses } from "./colors";

/**
 * A 12-week grid, one column per week and one row per weekday, where clicking
 * a cell toggles that day. Backfilling is intentional — people log a habit the
 * morning after as often as the evening of.
 *
 * Future days are rendered as spacers so the current week keeps its shape.
 */
export function HabitHeatmap({
  habitId,
  color,
  entries,
  onError,
}: {
  habitId: string;
  color: string;
  entries: DateKey[];
  onError: (message: string | null) => void;
}) {
  const [pending, startTransition] = useTransition();
  const done = new Set(entries);
  const classes = colorClasses(color);
  const today = todayKey();

  // Start on the Sunday of the week containing the oldest day in the window,
  // so every column is a full Sun–Sat week.
  const start = addDays(new Date(), -(WINDOW_DAYS - 1));
  const gridStart = addDays(start, -start.getDay());
  const weeks: DateKey[][] = [];
  for (let w = 0; w * 7 < WINDOW_DAYS + 7; w += 1) {
    const week: DateKey[] = [];
    for (let d = 0; d < 7; d += 1) {
      week.push(toDateKey(addDays(gridStart, w * 7 + d)));
    }
    weeks.push(week);
  }

  function toggle(date: DateKey) {
    startTransition(async () => {
      const result = await toggleHabitEntry(habitId, date, !done.has(date));
      onError(result.ok ? null : result.error);
    });
  }

  return (
    <div
      className={cn("flex gap-1 overflow-x-auto pb-1", pending && "opacity-70")}
    >
      {weeks.map((week, index) => (
        <div key={index} className="flex flex-col gap-1">
          {week.map((date) => {
            if (date > today) {
              return <span key={date} className="size-3.5" aria-hidden />;
            }
            const isDone = done.has(date);
            return (
              <button
                key={date}
                type="button"
                disabled={pending}
                onClick={() => toggle(date)}
                title={`${formatShortDate(date)} — ${isDone ? "done" : "not done"}`}
                aria-label={`${formatShortDate(date)}, ${isDone ? "done" : "not done"}`}
                aria-pressed={isDone}
                className={cn(
                  "size-3.5 rounded-sm transition focus-visible:outline-2 focus-visible:outline-offset-1",
                  classes.ring,
                  isDone
                    ? classes.filled
                    : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700",
                  date === today && "ring-1 ring-slate-400 dark:ring-slate-500",
                )}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
