import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

/**
 * Runs before every matched request (Next 16's replacement for `middleware`).
 * It refreshes the Supabase session cookies and keeps signed-out visitors out
 * of the app routes.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except Next internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
