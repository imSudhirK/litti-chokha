-- 0002_todos.sql — the todos feature.
--
-- Template for future feature migrations: one table, `user_id` referencing
-- profiles, RLS keyed on auth.uid(), an updated_at trigger, and an index that
-- matches how the feature's queries.ts actually reads the data.

create table public.todos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  title      text not null check (char_length(trim(title)) between 1 and 200),
  notes      text check (char_length(notes) <= 2000),
  done       boolean not null default false,
  due_date   date,
  position   double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.todos enable row level security;

create policy "todos: select own"
  on public.todos for select
  using (auth.uid() = user_id);

create policy "todos: insert own"
  on public.todos for insert
  with check (auth.uid() = user_id);

create policy "todos: update own"
  on public.todos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "todos: delete own"
  on public.todos for delete
  using (auth.uid() = user_id);

create trigger todos_set_updated_at
  before update on public.todos
  for each row execute function public.set_updated_at();

-- Matches the list query: one user's todos, open ones first, then by position.
create index todos_user_done_position_idx
  on public.todos (user_id, done, position, created_at desc);
