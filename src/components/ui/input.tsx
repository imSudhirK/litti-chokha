import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

const BASE =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 " +
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-slate-500 " +
  "disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

// `ComponentPropsWithRef` rather than `InputHTMLAttributes`: React 19 passes
// `ref` as an ordinary prop, and callers need it to focus these fields.
export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return <input className={cn(BASE, "h-10", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: ComponentPropsWithRef<"textarea">) {
  return <textarea className={cn(BASE, "min-h-20", className)} {...props} />;
}
