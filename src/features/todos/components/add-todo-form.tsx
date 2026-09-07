"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodo } from "../actions";
import { DueDateField } from "./due-date-field";

export function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTodo(formData);
      if (result.ok) {
        setError(null);
        formRef.current?.reset();
        setTitle("");
        // Adding todos comes in bursts — keep the cursor where it was so the
        // next one is just typing, with no click in between.
        titleRef.current?.focus();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          ref={titleRef}
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing?"
          aria-label="Todo title"
          maxLength={200}
          autoComplete="off"
          required
          disabled={pending}
          className="flex-1"
        />
        <DueDateField disabled={pending} />
        <Button
          type="submit"
          // An empty title only fails on the server, which costs a round trip
          // to say something the button can say for free.
          disabled={pending || title.trim() === ""}
          className="shrink-0"
        >
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
