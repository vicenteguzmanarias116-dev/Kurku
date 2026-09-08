-- Formulario de salud diario: sueño, ánimo, dolor general y mapa de dolor
-- muscular (una entrada por atleta por día).
create table if not exists health_checkins (
  id               uuid primary key default gen_random_uuid(),
  team_id          uuid not null references teams(id) on delete cascade,
  athlete_id       uuid not null references athletes(id) on delete cascade,
  checkin_date     date not null,
  sleep_hours      numeric,
  sleep_quality    smallint check (sleep_quality between 1 and 5),
  mood             smallint check (mood between 1 and 5),
  soreness_overall smallint check (soreness_overall between 1 and 5),
  notes            text,
  muscle_pain      jsonb, -- {"biceps_izq": 1|2|3, ...} (1 leve, 2 moderado, 3 fuerte)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (athlete_id, checkin_date)
);
create index if not exists health_checkins_team_date_idx on health_checkins (team_id, checkin_date);

alter table health_checkins enable row level security;

-- staff ve todo el equipo; el atleta ve y escribe lo suyo (o staff, si carga
-- por él).
create policy hc_read on health_checkins for select using (
  team_id = my_team_id() and (is_staff() or athlete_id in (select my_athlete_ids()))
);
create policy hc_write on health_checkins for all
  using (team_id = my_team_id() and (is_staff() or athlete_id in (select my_athlete_ids())))
  with check (team_id = my_team_id() and (is_staff() or athlete_id in (select my_athlete_ids())));
