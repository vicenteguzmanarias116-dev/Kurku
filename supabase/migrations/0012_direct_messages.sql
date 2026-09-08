-- Mensajes privados 1-a-1 entre cualquier par de miembros del mismo equipo
-- (atleta<->especialista, especialista<->proveedor, etc.) — no hay matriz de
-- permisos por rol, cualquiera puede escribirle a cualquiera de su equipo.
-- Los anuncios (announcements) siguen siendo el canal público, esto es aparte.
create table if not exists direct_messages (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references teams(id) on delete cascade,
  sender_id    uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  body         text not null,
  created_at   timestamptz not null default now(),
  read_at      timestamptz
);
create index if not exists dm_thread_idx on direct_messages (team_id, least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);
create index if not exists dm_recipient_unread_idx on direct_messages (recipient_id, read_at);

alter table direct_messages enable row level security;

create policy dm_read on direct_messages for select using (
  team_id = my_team_id() and (sender_id = auth.uid() or recipient_id = auth.uid())
);
create policy dm_insert on direct_messages for insert with check (
  team_id = my_team_id()
  and sender_id = auth.uid()
  and recipient_id in (select id from profiles where team_id = my_team_id())
);
-- solo el destinatario puede marcar como leído (update de read_at)
create policy dm_mark_read on direct_messages for update using (
  team_id = my_team_id() and recipient_id = auth.uid()
) with check (
  team_id = my_team_id() and recipient_id = auth.uid()
);
