-- kurku :: rutinas de entrenamiento por atleta (staff arma, atleta ejecuta)
--
-- "days" guarda los 7 dias de la semana como jsonb, calcado del formato del
-- prototipo original: {"0": {kind, title, focus, notes, exercises:[...]}, ...}
-- weekday 0=domingo .. 6=sabado (igual que Date.getDay()).

create table if not exists routines (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references teams(id) on delete cascade,
  athlete_id uuid not null unique references athletes(id) on delete cascade,
  title      text not null default 'Mi rutina',
  subtitle   text,
  days       jsonb not null default '{}'::jsonb,
  info       jsonb not null default '[]'::jsonb, -- [{title, items:[text,...]}]
  updated_at timestamptz not null default now()
);

create table if not exists exercise_logs (
  id              uuid primary key default gen_random_uuid(),
  athlete_id      uuid not null references athletes(id) on delete cascade,
  weekday         smallint not null check (weekday between 0 and 6),
  exercise_index  smallint not null,
  kg              numeric,
  reps            int,
  logged_at       timestamptz not null default now()
);
create index if not exists exercise_logs_lookup_idx
  on exercise_logs (athlete_id, weekday, exercise_index, logged_at desc);

create table if not exists routine_checks (
  athlete_id    uuid not null references athletes(id) on delete cascade,
  week_start    date not null,
  weekday       smallint not null check (weekday between 0 and 6),
  done_indexes  int[] not null default '{}',
  primary key (athlete_id, week_start, weekday)
);

alter table routines enable row level security;
alter table exercise_logs enable row level security;
alter table routine_checks enable row level security;

create policy routines_read on routines for select using (
  team_id = my_team_id() and (is_staff() or athlete_id in (select my_athlete_ids()))
);
create policy routines_write on routines for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());

create policy ex_logs_own on exercise_logs for all
  using (athlete_id in (select my_athlete_ids()))
  with check (athlete_id in (select my_athlete_ids()));

create policy checks_own on routine_checks for all
  using (athlete_id in (select my_athlete_ids()))
  with check (athlete_id in (select my_athlete_ids()));

-- al terminar la sesion, el atleta avisa al staff publicando en la pagina
-- del equipo (mismo canal que ya usan) - security definer para no necesitar
-- que el atleta tenga permiso de insertar en announcements en general.
create or replace function complete_training_session(p_title text)
returns void
  language plpgsql security definer set search_path = public as $$
declare
  v_athlete_id uuid;
  v_team_id    uuid;
  v_name       text;
begin
  select id, team_id, full_name into v_athlete_id, v_team_id, v_name
  from athletes where profile_id = auth.uid() limit 1;

  if v_athlete_id is null then
    raise exception 'No sos un atleta.';
  end if;

  insert into announcements (team_id, author_id, body)
  values (
    v_team_id,
    auth.uid(),
    coalesce(v_name, 'Un atleta') || ' completó su sesión de "' || p_title || '" 💪'
  );
end;
$$;
grant execute on function complete_training_session(text) to authenticated;
