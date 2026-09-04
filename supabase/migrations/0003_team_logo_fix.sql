-- kurku :: fix RLS de creación de equipo + storage para escudos

-- el creador de un equipo debe poder verlo aunque su profile.team_id
-- todavía no se haya actualizado (pasa justo después del insert)
alter table teams add column if not exists created_by uuid references auth.users(id) default auth.uid();

drop policy if exists team_read on teams;
create policy team_read on teams for select using (
  id = my_team_id() or created_by = auth.uid()
);

-- bucket para escudos/logos de equipo, subida por archivo
insert into storage.buckets (id, name, public)
values ('team-logos', 'team-logos', true)
on conflict (id) do nothing;

create policy "team logos: lectura publica" on storage.objects
  for select using (bucket_id = 'team-logos');

create policy "team logos: subida de usuarios logueados" on storage.objects
  for insert with check (bucket_id = 'team-logos' and auth.uid() is not null);
