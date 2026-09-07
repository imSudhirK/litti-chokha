import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/db.types";
import { env } from "@/lib/env";

/**
 * Supabase client for server components, server actions and route handlers.
 *
 * Always `await` a fresh one per request — never hoist it into a module-level
 * constant, or one user's session would leak into another's request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a server component, where cookies are read-only.
            // The middleware refreshes the session instead, so this is safe.
          }
        },
      },
    },
  );
}
