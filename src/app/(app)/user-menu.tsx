import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { CurrentUser } from "@/lib/auth";

export function UserMenu({ user }: { user: CurrentUser }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={user.avatarUrl} alt={user.displayName} size={28} />
      <span className="hidden text-sm text-slate-600 sm:inline dark:text-slate-400">
        {user.displayName}
      </span>
      <form action="/auth/signout" method="post">
        <Button type="submit" variant="ghost" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
