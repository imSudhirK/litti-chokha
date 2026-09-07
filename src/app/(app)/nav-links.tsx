"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/lib/navigation";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
