import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/db.types";
import { env } from "@/lib/env";

/**
 * Supabase client for client components. Used only for auth gestures
 * (sign in / sign out) — all data access goes through server queries and
 * actions, see src/features/README.md.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
