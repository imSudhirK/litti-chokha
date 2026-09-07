"use client";

import { Button } from "@/components/ui/button";

/**
 * Catches anything a feature page throws (a failed query, a bad session) so
 * one broken feature doesn't take the whole shell down.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/60 dark:bg-rose-950/40">
      <h1 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
        Something went wrong
      </h1>
      <p className="mt-1 text-sm text-rose-800 dark:text-rose-300">
        {error.message || "Please try again."}
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={reset}
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}
