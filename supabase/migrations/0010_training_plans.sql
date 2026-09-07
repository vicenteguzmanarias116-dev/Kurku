-- Planes de entrenamiento (gym/bici/vela) sobre la tabla events existente:
-- un evento de kind='training' puede tener un tipo de plan, un athlete_id
-- (null = para todo el equipo) y una lista de ejercicios/intervalos.
alter table events add column if not exists athlete_id uuid references athletes(id) on delete cascade;
alter table events add column if not exists plan_type text check (plan_type in ('gym','bike','sailing','other'));
alter table events add column if not exists plan_items jsonb; -- [{label: text}]

create index if not exists events_athlete_idx on events (athlete_id);
