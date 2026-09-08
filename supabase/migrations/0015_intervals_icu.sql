-- Credenciales de Intervals.icu por atleta. Tabla aparte de "profiles"
-- (que cualquiera del equipo puede leer por RLS) porque esto es una
-- API key personal: nadie más que el propio dueño debe poder verla.
create table if not exists integrations (
  id                 uuid primary key default gen_random_uuid(),
  profile_id         uuid not null unique references profiles(id) on delete cascade,
  intervals_athlete_id text,
  intervals_api_key    text,
  last_synced_at       timestamptz,
  created_at           timestamptz not null default now()
);

alter table integrations enable row level security;

create policy integrations_self on integrations for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
