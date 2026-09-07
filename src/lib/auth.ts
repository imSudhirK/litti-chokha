import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};

/**
 * The signed-in user, or a redirect to /login.
 *
 * Every server query and action calls this first. The middleware already gates
 * the routes, but authorization is re-checked here so a feature is safe even
 * if it is later reachable by some path the matcher does not cover.
 */
export async function requireUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, email")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? "",
    displayName:
      profile?.display_name ??
      (user.user_metadata.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "there",
    avatarUrl:
      profile?.avatar_url ??
      (user.user_metadata.avatar_url as string | undefined) ??
      null,
  };
}
