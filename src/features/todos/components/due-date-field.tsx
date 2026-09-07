"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { formatShortDate, todayKey } from "@/lib/date";

/**
 * A compact due-date control: just a calendar icon until a date is picked,
 * then a small chip showing it with a clear button.
 *
 * The real `<input type="date">` is kept in the DOM (zero-sized, not
 * `display: none`) rather than replaced with a custom calendar — it still
 * carries the form value, still validates, and `showPicker()` gives us the
 * platform's native date UI, which is better on mobile than anything hand-built.
 */
export function DueDateField({
  name = "due_date",
  defaultValue = "",
  disabled,
}: {
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const id = useId();

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    try {
      // Not in every browser yet; focusing at least reveals the field.
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  const overdue = value !== "" && value < todayKey();

  return (
    <div className="relative shrink-0">
      <input
        ref={inputRef}
        id={id}
        type="date"
        name={name}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        // Zero-sized but still rendered, so showPicker() anchors here.
        className="absolute bottom-0 left-1/2 size-0 opacity-0"
        // Skipped in the tab order — the button beside it is the control —
        // but left readable, so it isn't an aria-hidden element that can
        // still take programmatic focus.
        tabIndex={-1}
        aria-label="Due date"
      />

      <div
        className={cn(
          "flex h-10 items-center rounded-lg border border-slate-300 bg-white text-sm transition dark:border-slate-700 dark:bg-slate-900",
          value ? "gap-1 pr-1 pl-2.5" : "w-10 justify-center",
          disabled && "opacity-60",
        )}
      >
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          aria-label={
            value
              ? `Due ${formatShortDate(value)}. Change due date`
              : "Add a due date"
          }
          title={value ? `Due ${formatShortDate(value)}` : "Add a due date"}
          className={cn(
            "flex items-center gap-1.5 rounded-md text-slate-500 transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:text-slate-400 dark:hover:text-slate-100",
            value && "text-slate-800 dark:text-slate-200",
          )}
        >
          <CalendarIcon />
          {value ? (
            <span
              className={cn(
                "text-xs font-medium whitespace-nowrap",
                overdue && "text-rose-600 dark:text-rose-400",
              )}
            >
              {formatShortDate(value)}
            </span>
          ) : null}
        </button>

        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            disabled={disabled}
            aria-label="Clear due date"
            title="Clear due date"
            className="flex size-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
