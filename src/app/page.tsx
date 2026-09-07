import { redirect } from "next/navigation";

import { HOME_PATH } from "@/lib/navigation";

/** The middleware has already decided whether there's a session by this point. */
export default function RootPage() {
  redirect(HOME_PATH);
}
