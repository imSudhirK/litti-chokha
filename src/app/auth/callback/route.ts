import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Google sends the user back here with a one-time code. We exchange it for a
 * session cookie and send them into the app.
 *
 * The signup trigger in 0001_init.sql rejects non-invited emails, which
 * surfaces here as an exchange error — we translate it into the "not invited"
 * message on /login rather than leaking a database error.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/todos";

  const providerError =
    searchParams.get("error_description") ?? searchParams.get("error");

  if (providerError) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(reason(providerError))}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(reason(error.message))}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}

/** Maps a raw provider/database message onto a code the login page knows. */
function reason(message: string): string {
  return message.includes("not_invited") ? "not_invited" : "sign_in_failed";
}
