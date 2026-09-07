import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const BASE =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 " +
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-slate-500 " +
  "disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(BASE, "h-10", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(BASE, "min-h-20", className)} {...props} />;
}
