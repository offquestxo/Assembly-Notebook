-- Assembly Notebook: initial schema (draft — review before running)
-- Access model: each device signs in anonymously; the `join` Edge Function adds the
-- device's auth user to `members` after checking the family code. Only members can
-- read or write family data.

create table if not exists public.members (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now()
);
alter table public.members enable row level security;
create policy "read own membership" on public.members
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_member() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where user_id = auth.uid());
$$;

create table if not exists public.profiles (
  id         text primary key,
  name       text not null check (char_length(name) between 1 and 20),
  color      text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  part       text not null,
  profile_id text not null references public.profiles(id) on delete cascade,
  text       text not null default '' check (char_length(text) <= 6000),
  updated_at timestamptz not null default now(),
  primary key (part, profile_id)
);

create table if not exists public.game_state (
  profile_id text primary key references public.profiles(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.chat (
  id         text primary key,
  profile_id text not null references public.profiles(id) on delete cascade,
  text       text not null check (char_length(text) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.predictions (
  part       text not null,
  profile_id text not null references public.profiles(id) on delete cascade,
  words      jsonb not null default '[]'::jsonb,
  hits       jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (part, profile_id)
);

create table if not exists public.live_quiz (
  id         text primary key,
  created_by text references public.profiles(id) on delete set null,
  question   text not null check (char_length(question) between 1 and 300),
  options    jsonb not null,
  correct    int,
  status     text not null default 'open' check (status in ('open','revealed')),
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  quiz_id    text not null references public.live_quiz(id) on delete cascade,
  profile_id text not null references public.profiles(id) on delete cascade,
  choice     int not null,
  created_at timestamptz not null default now(),
  primary key (quiz_id, profile_id)
);

-- Members-only access + realtime on every family table
do $$
declare t text;
begin
  foreach t in array array['profiles','notes','game_state','chat','predictions','live_quiz','quiz_answers'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "family members" on public.%I for all to authenticated using (public.is_member()) with check (public.is_member())', t);
    execute format('alter publication supabase_realtime add table public.%I', t);
  end loop;
end $$;

-- At most 7 profiles per family
create or replace function public.enforce_profile_limit() returns trigger
  language plpgsql as $$
begin
  if (select count(*) from public.profiles) >= 7 then
    raise exception 'The family already has 7 people';
  end if;
  return new;
end $$;
drop trigger if exists profiles_limit on public.profiles;
create trigger profiles_limit before insert on public.profiles
  for each row execute function public.enforce_profile_limit();
