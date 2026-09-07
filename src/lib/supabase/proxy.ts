import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/** Routes reachable without a session. Everything else redirects to /login. */
const PUBLIC_PATHS = ["/login", "/auth"];

/**
 * Refreshes the auth cookies on every request and gates the app routes.
 * Called from src/proxy.ts.
 *
 * The response object must be the one the Supabase client wrote cookies onto,
 * so we mutate `response` in place rather than creating a new one at the end.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser() revalidates the token with Supabase; getSession() only decodes
  // the cookie and must not be trusted for authorization decisions.
  //
  // If Supabase is unreachable this throws. Failing closed (no user) sends
  // people to /login, which is a recoverable dead end — letting it propagate
  // would 500 every route in the app, including /login itself.
  let user = null;
  try {
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/todos";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
