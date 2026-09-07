"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { createHabit } from "../actions";
import { HABIT_COLORS, type HabitColor } from "../schema";
import { HABIT_COLOR_CLASSES } from "./colors";

export function AddHabitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [color, setColor] = useState<HabitColor>("emerald");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createHabit(formData);
      if (result.ok) {
        setError(null);
        formRef.current?.reset();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="name"
          placeholder="Track a new habit — e.g. Read 20 minutes"
          aria-label="Habit name"
          maxLength={80}
          required
          disabled={pending}
        />
        <input type="hidden" name="color" value={color} />
        <div
          role="radiogroup"
          aria-label="Habit color"
          className="flex shrink-0 items-center gap-1.5 px-1"
        >
          {HABIT_COLORS.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={color === option}
              aria-label={option}
              onClick={() => setColor(option)}
              className={cn(
                "size-5 rounded-full transition",
                HABIT_COLOR_CLASSES[option].dot,
                color === option
                  ? "ring-2 ring-slate-900 ring-offset-2 dark:ring-slate-100 dark:ring-offset-slate-950"
                  : "opacity-50 hover:opacity-100",
              )}
            />
          ))}
        </div>
        <Button type="submit" disabled={pending} className="shrink-0">
          {pending ? "Adding…" : "Add"}
        </Button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </form>
  );
}
