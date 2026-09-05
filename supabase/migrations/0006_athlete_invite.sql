-- kurku :: invitar atletas por link
--
-- Un link "/unirse/<team_id>" deja que cualquiera con la URL se una al
-- equipo como atleta (auto-signup) sin que el coach tenga que crearlo
-- a mano. join_team_for_me() hace todo en una función atómica, igual
-- que create_team_for_me(), para no repetir el bug de RLS+NULL de la
-- migración anterior.

-- info publica minima del equipo, para mostrar el nombre antes de unirse
create or replace function team_public_info(p_team_id uuid)
returns table(name text, logo_url text)
  language sql stable security definer set search_path = public as $$
  select name, logo_url from teams where id = p_team_id
$$;
grant execute on function team_public_info(uuid) to authenticated, anon;

create or replace function join_team_for_me(p_team_id uuid)
returns uuid
  language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_existing uuid;
  v_full_name text;
  v_athlete_id uuid;
begin
  if v_uid is null then
    raise exception 'No autenticado.';
  end if;

  select team_id, full_name into v_existing, v_full_name from profiles where id = v_uid;
  if v_existing is not null then
    raise exception 'Ya perteneces a un equipo.';
  end if;

  if not exists (select 1 from teams where id = p_team_id) then
    raise exception 'Equipo no encontrado.';
  end if;

  update profiles set team_id = p_team_id, role = 'athlete' where id = v_uid;

  insert into athletes (team_id, profile_id, full_name)
  values (p_team_id, v_uid, coalesce(v_full_name, ''))
  returning id into v_athlete_id;

  return v_athlete_id;
end;
$$;
grant execute on function join_team_for_me(uuid) to authenticated;

-- un atleta puede editar su propia fila (completar sus datos), aparte
-- de lo que ya puede editar el staff (ath_write)
create policy ath_self_update on athletes for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid() and team_id = my_team_id());
