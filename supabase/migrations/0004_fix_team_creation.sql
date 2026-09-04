-- kurku :: arregla la creación de equipo
--
-- Bug 1: prof_read usaba "team_id = my_team_id()", que en SQL nunca es
-- verdadero cuando ambos lados son NULL (un usuario sin equipo no podía
-- leer ni su propio perfil).
-- Bug 2 (consecuencia): como el profile no se podía leer de vuelta, el
-- insert+update de "crear equipo" hecho en dos pasos desde el cliente
-- terminaba creando el equipo pero sin poder confirmar/aplicar el update
-- del team_id de forma confiable. Se movió toda la operación a una sola
-- función atómica (security definer, sin pasar por RLS).

drop policy if exists prof_read on profiles;
create policy prof_read on profiles for select using (
  id = auth.uid() or team_id = my_team_id()
);

create or replace function create_team_for_me(
  p_name text,
  p_location text,
  p_description text,
  p_logo_url text
) returns uuid
  language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_existing uuid;
  v_team_id uuid;
begin
  if v_uid is null then
    raise exception 'No autenticado.';
  end if;

  select team_id into v_existing from profiles where id = v_uid;
  if v_existing is not null then
    raise exception 'Ya perteneces a un equipo.';
  end if;

  insert into teams (name, sport, description, location, logo_url)
  values (p_name, 'sailing', p_description, p_location, p_logo_url)
  returning id into v_team_id;

  update profiles set team_id = v_team_id, role = 'admin' where id = v_uid;

  return v_team_id;
end;
$$;

grant execute on function create_team_for_me(text, text, text, text) to authenticated;

-- limpieza: equipos huérfanos creados por el bug (sin ningún profile
-- apuntando a ellos todavía)
delete from teams t
where not exists (select 1 from profiles p where p.team_id = t.id)
  and t.id <> '00000000-0000-0000-0000-000000000001';
