-- 0001_init.sql — identity, the invite allowlist, and shared helpers.
--
-- Everything in this app hangs off two ideas:
--   1. a row belongs to exactly one user (`user_id`), and RLS enforces that;
--   2. you cannot become a user at all unless your email is on the allowlist.

-- ---------------------------------------------------------------------------
-- Shared helpers (reused by every later feature migration)
-- ---------------------------------------------------------------------------

-- Keeps `updated_at` honest without the application having to remember.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- allowlist — the 20-user cap
-- ---------------------------------------------------------------------------

create table public.allowlist (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.allowlist enable row level security;

-- No policies on purpose: the allowlist is invisible to the client and is
-- managed from the Supabase dashboard (or with the service role key). The
-- trigger below reads it as SECURITY DEFINER, which bypasses RLS.

-- ---------------------------------------------------------------------------
-- profiles — one row per signed-in user
-- ---------------------------------------------------------------------------

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Inserts happen only via the trigger below, so there is no insert policy.

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Signup gate
-- ---------------------------------------------------------------------------

-- Runs inside the transaction that creates the auth.users row. Raising here
-- aborts the whole signup, so a non-invited Google account never becomes a
-- user at all — there is no client-side path around this.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.allowlist
    where lower(email) = lower(new.email)
  ) then
    raise exception 'not_invited'
      using hint = 'This email is not on the invite list.';
  end if;

  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
