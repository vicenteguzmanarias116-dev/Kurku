-- vela-team :: schema inicial (MVP)
-- Correr a mano en el SQL Editor del proyecto Supabase NUEVO (no el de TodoEventos).

create extension if not exists "pgcrypto";

-- ────────────────────────────── tablas ──────────────────────────────
create table teams (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sport      text not null default 'sailing',
  created_at timestamptz not null default now()
);

create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  team_id    uuid references teams(id) on delete set null,
  role       text not null default 'athlete' check (role in ('admin','coach','athlete')),
  full_name  text,
  created_at timestamptz not null default now()
);

create table athletes (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references teams(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,  -- si el atleta tiene login
  full_name  text not null,
  boat_class text,               -- ILCA 4 / ILCA 6 / ILCA 7
  birthdate  date,
  weight_kg  numeric,
  photo_url  text,
  active     boolean not null default true,
  notes      text,
  created_at timestamptz not null default now()
);
create index on athletes (team_id);

create table training_sessions (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid not null references teams(id) on delete cascade,
  athlete_id    uuid not null references athletes(id) on delete cascade,
  session_date  date not null,
  source        text not null default 'manual',   -- manual/gpx/fit/tcx/garmin/sailmon/...
  duration_s    integer,
  distance_m    numeric,
  avg_speed_kn  numeric,
  max_speed_kn  numeric,
  tacks         integer,
  gybes         integer,
  rpe           integer check (rpe between 1 and 10),
  track         jsonb,            -- traza downsampled: [{t,lat,lng,sog,cog}]
  raw_file_path text,             -- ruta en Storage del archivo original
  metrics       jsonb,
  created_at    timestamptz not null default now()
);
create index on training_sessions (team_id, session_date);
create index on training_sessions (athlete_id, session_date);

create table events (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  kind        text not null default 'training' check (kind in ('training','regatta','other')),
  title       text not null,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  location    text,
  description text,
  created_at  timestamptz not null default now()
);
create index on events (team_id, starts_at);

create table announcements (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references teams(id) on delete cascade,
  author_id  uuid references profiles(id) on delete set null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index on announcements (team_id, created_at desc);

-- ────────────────────────────── helpers ─────────────────────────────
create or replace function my_team_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select team_id from profiles where id = auth.uid()
$$;

create or replace function is_staff() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists(select 1 from profiles where id = auth.uid() and role in ('admin','coach'))
$$;

-- atleta (fila de athletes) vinculado al usuario actual
create or replace function my_athlete_ids() returns setof uuid
  language sql stable security definer set search_path = public as $$
  select id from athletes where profile_id = auth.uid()
$$;

-- ─────────────────────── alta de usuario -> profile ─────────────────────
-- ponytail: un solo equipo fijo. Multi-equipo cuando exista el 2o equipo/deporte.
insert into teams (id, name, sport)
values ('00000000-0000-0000-0000-000000000001', 'Equipo de Vela', 'sailing');

create or replace function handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(*) into n from profiles;
  insert into profiles (id, team_id, role, full_name)
  values (
    new.id,
    '00000000-0000-0000-0000-000000000001',
    case when n = 0 then 'admin' else 'athlete' end,   -- primer usuario = admin
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- un no-staff no puede cambiarse role ni team
create or replace function protect_profile() returns trigger
  language plpgsql set search_path = public as $$
begin
  if not is_staff() then
    new.role    := old.role;
    new.team_id := old.team_id;
  end if;
  return new;
end $$;

create trigger trg_protect_profile
  before update on profiles
  for each row execute function protect_profile();

-- ────────────────────────────── RLS ─────────────────────────────────
alter table teams              enable row level security;
alter table profiles           enable row level security;
alter table athletes           enable row level security;
alter table training_sessions  enable row level security;
alter table events             enable row level security;
alter table announcements      enable row level security;

-- teams
create policy team_read   on teams for select using (id = my_team_id());
create policy team_update on teams for update using (is_staff() and id = my_team_id());

-- profiles
create policy prof_read   on profiles for select using (team_id = my_team_id());
create policy prof_update on profiles for update using (id = auth.uid());

-- athletes: todo el equipo lee; solo staff escribe
create policy ath_read  on athletes for select using (team_id = my_team_id());
create policy ath_write on athletes for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());

-- training_sessions: staff ve todo; atleta ve lo suyo
create policy ts_read on training_sessions for select using (
  team_id = my_team_id() and (is_staff() or athlete_id in (select my_athlete_ids()))
);
create policy ts_write on training_sessions for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());

-- events / announcements: equipo lee, staff escribe
create policy ev_read  on events for select using (team_id = my_team_id());
create policy ev_write on events for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());

create policy an_read  on announcements for select using (team_id = my_team_id());
create policy an_write on announcements for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());

-- ─────────────────────── vista de carga (ACWR) ──────────────────────
-- carga por sesion = duracion en minutos * RPE (si no hay RPE, solo minutos).
-- agudo = media diaria ult. 7d ; cronico = media diaria ult. 28d ; ratio = agudo/cronico.
create or replace view v_athlete_load with (security_invoker = true) as
with daily as (
  select athlete_id,
         session_date,
         sum(coalesce(duration_s,0)/60.0 * coalesce(rpe,1)) as load
  from training_sessions
  group by athlete_id, session_date
)
select
  a.id  as athlete_id,
  a.full_name,
  coalesce((select sum(load) from daily d
            where d.athlete_id = a.id and d.session_date > current_date - 7),0)  / 7  as acute,
  coalesce((select sum(load) from daily d
            where d.athlete_id = a.id and d.session_date > current_date - 28),0) / 28 as chronic
from athletes a;

-- acwr = acute / nullif(chronic,0)  -> se calcula en la app
