-- Raise the family profile limit from 7 to 20. Safe to run more than once.
create or replace function public.enforce_profile_limit() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.profiles where id = new.id) then
    return new;
  end if;
  if (select count(*) from public.profiles) >= 20 then
    raise exception 'The family is full (20 people)';
  end if;
  return new;
end $$;
