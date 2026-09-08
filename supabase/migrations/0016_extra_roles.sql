-- Nuevos roles de staff: preparador físico y nutricionista.
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('admin','coach','fisico','nutricionista','athlete'));

create or replace function is_staff() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from profiles
    where id = auth.uid() and role in ('admin','coach','fisico','nutricionista')
  )
$$;
