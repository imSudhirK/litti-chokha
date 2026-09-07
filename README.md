# Litti Chokha

A private todos + habit-tracker web app for a small invited group (~20 people).
Google sign-in, invite-only, free to run.

- **Todos** — add, edit, complete, delete, with optional due dates.
- **Habits** — daily check-ins with current/longest streaks and a 12-week
  heatmap you can click to backfill.
- **Google login** — invite-only; an email must be on the allowlist to sign up.

Stack: Next.js 16 (App Router) · Supabase (Postgres + Auth + RLS) · Tailwind v4
· TypeScript. Deploys on the Vercel and Supabase free tiers.

Architecture and the rules for adding features are in [AGENTS.md](AGENTS.md).

---

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. **SQL Editor** → run each file in `supabase/migrations/` **in order**:
   `0001_init.sql`, `0002_todos.sql`, `0003_habits.sql`.
3. Invite yourself — nobody can sign in until they're on the allowlist:

   ```sql
   insert into public.allowlist (email, note) values ('you@example.com', 'owner');
   ```

### 2. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) →
   **Create credentials → OAuth client ID → Web application**.
2. Authorized redirect URI:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Supabase → **Authentication → Providers → Google**: enable it and paste the
   client ID and secret.
4. Supabase → **Authentication → URL Configuration**: add
   `http://localhost:3000/auth/callback` and, once deployed,
   `https://<your-app>.vercel.app/auth/callback` to the redirect allowlist.

### 3. Run it

```bash
cp .env.example .env.local     # fill in from Supabase → Project Settings → API
npm install
npm run dev                    # http://localhost:3000
```

Node 22+ is recommended — `@supabase/supabase-js` warns on Node 20.

### 4. Deploy

Push to GitHub, import the repo at [vercel.com](https://vercel.com), and set
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Then add the
deployed `/auth/callback` URL to Supabase's redirect allowlist (step 2.4).

## Managing who can sign in

The `allowlist` table is the gate. It is enforced by a database trigger on
signup, so a non-invited Google account never becomes a user at all — there is
no way around it from the client.

```sql
-- invite someone
insert into public.allowlist (email, note) values ('friend@example.com', 'beta');

-- see who's in
select * from public.allowlist;

-- revoke an invite (does not delete an existing account)
delete from public.allowlist where email = 'friend@example.com';
```

To remove someone who already signed up, delete them from
**Authentication → Users**; their todos and habits cascade away with them.

## Scripts

| Command             | What it does     |
| ------------------- | ---------------- |
| `npm run dev`       | Dev server       |
| `npm run build`     | Production build |
| `npm run typecheck` | `tsc --noEmit`   |
| `npm run lint`      | ESLint           |
| `npm run format`    | Prettier         |

## Free-tier limits

Supabase free tier pauses a project after ~1 week with no activity (resume it
from the dashboard) and allows 500 MB of database — orders of magnitude more
than 20 people's todos need. Vercel's free tier covers the traffic comfortably.
