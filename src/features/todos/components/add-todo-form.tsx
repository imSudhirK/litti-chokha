"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodo } from "../actions";

export function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTodo(formData);
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
          name="title"
          placeholder="What needs doing?"
          aria-label="Todo title"
          maxLength={200}
          required
          disabled={pending}
        />
        <Input
          type="date"
          name="due_date"
          aria-label="Due date (optional)"
          className="w-40 shrink-0"
          disabled={pending}
        />
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
