-- Gestión de lesiones (a lo AthleteMonitoring): registro formal por atleta,
-- con estado y retorno estimado — distinto del mapa de dolor diario, que es
-- solo un check-in rápido. Solo staff carga/edita; el atleta ve lo suyo.
create table if not exists injuries (
  id             uuid primary key default gen_random_uuid(),
  team_id        uuid not null references teams(id) on delete cascade,
  athlete_id     uuid not null references athletes(id) on delete cascade,
  body_part      text not null,
  description    text,
  severity       smallint check (severity between 1 and 5),
  status         text not null default 'activa' check (status in ('activa','recuperando','de_alta')),
  reported_date  date not null default current_date,
  expected_return date,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists injuries_team_idx on injuries (team_id, status);
create index if not exists injuries_athlete_idx on injuries (athlete_id);

alter table injuries enable row level security;

create policy inj_read on injuries for select using (
  team_id = my_team_id() and (is_staff() or athlete_id in (select my_athlete_ids()))
);
create policy inj_write on injuries for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());
