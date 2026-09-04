-- kurku :: onboarding de equipos
-- Un coach/staff crea su cuenta y luego crea su propio equipo (nombre, escudo,
-- descripción, ubicación). Ya no hay un equipo único fijo para todos.

alter table teams add column if not exists logo_url    text;
alter table teams add column if not exists description text;
alter table teams add column if not exists location    text;

-- alta de usuario: ya no se asigna equipo automático ni admin por orden de llegada
create or replace function handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;

-- un usuario SIN equipo puede fijar su propio team_id/role una vez (crear su equipo).
-- una vez que pertenece a un equipo, solo staff puede tocar esos campos (como antes).
create or replace function protect_profile() returns trigger
  language plpgsql set search_path = public as $$
begin
  if not is_staff() and old.team_id is not null then
    new.role    := old.role;
    new.team_id := old.team_id;
  end if;
  return new;
end $$;

-- alta de equipos: solo quien todavía no tiene equipo puede crear uno
create policy team_insert on teams for insert
  with check (
    auth.uid() is not null
    and (select team_id from profiles where id = auth.uid()) is null
  );
