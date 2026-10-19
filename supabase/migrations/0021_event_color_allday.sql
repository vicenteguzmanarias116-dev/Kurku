-- Eventos: color de la franja en el calendario y "sin hora" (evento de todo el día).
alter table events add column if not exists all_day boolean not null default false;
alter table events add column if not exists color text;
