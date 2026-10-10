-- Assembly Notebook: schema. Safe to run more than once (SQL Editor → paste → Run).
-- Access model: each device signs in anonymously; the `join` Edge Function adds the
-- device's auth user to `members` after checking the family code. Only members can
-- read or write family data. One family per project.

create table if not exists public.members (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now()
);
alter table public.members enable row level security;
drop policy if exists "read own membership" on public.members;
create policy "read own membership" on public.members
  for select to authenticated using (user_id = auth.uid());
-- No insert/update/delete policy: only the `join` function (service role) adds members.

create or replace function public.is_member() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where user_id = auth.uid());
$$;
revoke all on function public.is_member() from public, anon;
grant execute on function public.is_member() to authenticated;

create table if not exists public.profiles (
  id         text primary key check (char_length(id) <= 40),
  name       text not null check (char_length(name) between 1 and 20),
  color      text not null check (char_length(color) <= 20),
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  part       text not null check (char_length(part) <= 20),
  profile_id text not null references public.profiles(id) on delete cascade,
  text       text not null default '' check (char_length(text) <= 6000),
  updated_at timestamptz not null default now(),
  primary key (part, profile_id)
);

create table if not exists public.game_state (
  profile_id text primary key references public.profiles(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb check (pg_column_size(data) <= 20000),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat (
  id         text primary key check (char_length(id) <= 40),
  profile_id text not null references public.profiles(id) on delete cascade,
  text       text not null check (char_length(text) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists chat_created_at on public.chat (created_at desc);

create table if not exists public.predictions (
  part       text not null check (char_length(part) <= 20),
  profile_id text not null references public.profiles(id) on delete cascade,
  words      jsonb not null default '[]'::jsonb,
  hits       jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (part, profile_id)
);

create table if not exists public.live_quiz (
  id         text primary key check (char_length(id) <= 40),
  created_by text references public.profiles(id) on delete set null,
  question   text not null check (char_length(question) between 1 and 300),
  options    jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 4),
  correct    int,
  status     text not null default 'open' check (status in ('open','revealed')),
  created_at timestamptz not null default now()
);
-- 'family' = posted by a person (answers hidden until Reveal); 'lunch'/'ride' = AI quiz from notes.
alter table public.live_quiz add column if not exists kind text not null default 'family';
alter table public.live_quiz add column if not exists lang text;

create table if not exists public.quiz_answers (
  quiz_id    text not null references public.live_quiz(id) on delete cascade,
  profile_id text not null references public.profiles(id) on delete cascade,
  choice     int not null check (choice between 0 and 3),
  created_at timestamptz not null default now(),
  primary key (quiz_id, profile_id)
);

-- Members-only access + realtime on every family table
do $$
declare t text;
begin
  foreach t in array array['profiles','notes','game_state','chat','predictions','live_quiz','quiz_answers'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "family members" on public.%I', t);
    execute format('create policy "family members" on public.%I for all to authenticated using (public.is_member()) with check (public.is_member())', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('revoke all on public.%I from anon', t);
    if not exists (select 1 from pg_publication_tables
                   where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
grant select on public.members to authenticated;

-- At most 7 profiles per family. Upserts of an existing profile (rename/recolor) are allowed.
create or replace function public.enforce_profile_limit() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.profiles where id = new.id) then
    return new;
  end if;
  if (select count(*) from public.profiles) >= 7 then
    raise exception 'The family already has 7 people';
  end if;
  return new;
end $$;
drop trigger if exists profiles_limit on public.profiles;
create trigger profiles_limit before insert on public.profiles
  for each row execute function public.enforce_profile_limit();
