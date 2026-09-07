<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Litti Chokha

A private todo + habit-tracking app for ~20 invited people. Next.js 16 (App
Router) on Vercel, Supabase for Postgres and Google auth. Both tiers are free
at this scale — keep it that way.

## Layout

```
src/app/           routing only — thin pages that compose features
  (app)/           the signed-in shell (nav, user menu, error + loading boundaries)
  login/           the only unauthenticated page
  auth/            OAuth callback and sign-out route handlers
src/features/<n>/  one self-contained folder per feature
src/lib/           cross-cutting: supabase clients, auth, dates, env, nav registry
src/components/ui/ primitives shared by more than one feature
supabase/migrations/  one SQL file per feature, applied in order
```

## The rules that keep this extensible

1. **A feature is a folder.** `src/features/<name>/` holds `schema.ts`,
   `queries.ts`, `actions.ts`, `types.ts` and `components/`. Adding a feature
   should not require editing an existing one.
2. **No cross-feature imports.** If two features need the same thing, it moves
   to `src/lib/` or `src/components/ui/` first.
3. **Components never call Supabase.** Reads go through `queries.ts` (server
   components), writes through `actions.ts` (server actions). This is what lets
   the backend change without touching the UI.
4. **Every action: authenticate → validate → write scoped to the user →
   `revalidatePath`.** Use `requireUser()` from `src/lib/auth.ts`, a zod schema
   from the feature's `schema.ts`, and return `ActionResult` from
   `src/lib/action-result.ts`. Expected failures return `{ ok: false }`; only
   unexpected ones throw.
5. **Types shared with client components live in `types.ts`, not `queries.ts`.**
   `queries.ts` is `server-only` — importing a _value_ from it in a client
   component drags the server Supabase client into the browser bundle and fails
   the build.
6. **Authorization lives in the database.** Every table has RLS keyed on
   `auth.uid()`. The `.eq("user_id", …)` filters in queries are for clarity and
   index use, never the only defence.
7. **Calendar days are `YYYY-MM-DD` strings** via `src/lib/date.ts`. Never
   `toISOString()` — it shifts a late-evening entry into tomorrow.

## Adding a feature — the checklist

1. `supabase/migrations/000N_<name>.sql`: table with `user_id` → `profiles`,
   `enable row level security`, four policies, an `updated_at` trigger reusing
   `public.set_updated_at()`, and an index matching the list query.
2. Add its tables to `src/lib/db.types.ts` (or regenerate — see the file header).
3. `src/features/<name>/`: `schema.ts` → `types.ts` → `queries.ts` →
   `actions.ts` → `components/`. Copy the shape of `features/todos/`.
4. `src/app/(app)/<name>/page.tsx` — a thin server component.
5. One entry in `NAV_ITEMS` in `src/lib/navigation.ts`.

## Before you call it done

```
npm run typecheck && npm run lint && npm run build
```
