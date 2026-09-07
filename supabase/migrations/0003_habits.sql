-- 0003_habits.sql — the habit / streak tracker.
--
-- A habit_entries row means "this habit was done on this date". Absence means
-- not done, so toggling a day is an insert or a delete and there is no state to
-- keep in sync. Streaks are derived from these dates at read time.

create table public.habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  name       text not null check (char_length(trim(name)) between 1 and 80),
  color      text not null default 'emerald',
  archived   boolean not null default false,
  position   double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "habits: select own"
  on public.habits for select using (auth.uid() = user_id);
create policy "habits: insert own"
  on public.habits for insert with check (auth.uid() = user_id);
create policy "habits: update own"
  on public.habits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits: delete own"
  on public.habits for delete using (auth.uid() = user_id);

create trigger habits_set_updated_at
  before update on public.habits
  for each row execute function public.set_updated_at();

create index habits_user_idx on public.habits (user_id, archived, position);

-- ---------------------------------------------------------------------------

create table public.habit_entries (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, entry_date)
);

alter table public.habit_entries enable row level security;

create policy "habit_entries: select own"
  on public.habit_entries for select using (auth.uid() = user_id);
create policy "habit_entries: insert own"
  on public.habit_entries for insert with check (auth.uid() = user_id);
create policy "habit_entries: delete own"
  on public.habit_entries for delete using (auth.uid() = user_id);

-- Updates are meaningless here (a row is just a marker), so no update policy.

-- Matches the heatmap query: one user's entries over a recent date window.
create index habit_entries_user_date_idx
  on public.habit_entries (user_id, entry_date desc);
