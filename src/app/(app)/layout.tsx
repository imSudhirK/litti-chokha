import type { ReactNode } from "react";

import { requireUser } from "@/lib/auth";
import { NavLinks } from "./nav-links";
import { UserMenu } from "./user-menu";

/**
 * The signed-in shell. Every feature route renders inside it and gets auth,
 * navigation and layout for free — a new feature only writes its own page.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-3">
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Litti Chokha
          </span>
          <NavLinks />
          <div className="ml-auto">
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  );
}
