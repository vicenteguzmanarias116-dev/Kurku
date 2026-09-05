-- kurku :: cuenta de usuario (avatar, etc.) + rol de administrador
--
-- El que crea el equipo ya queda con role='admin' (create_team_for_me).
-- Los demas coaches invitados quedan como 'coach'. Un admin puede editar
-- el perfil de cualquier compañero de equipo (para sacarlo del equipo,
-- por ejemplo); un coach solo puede editar el suyo (ya cubierto por
-- prof_update).

alter table profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars: lectura publica" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars: subida de usuarios logueados" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid() is not null);

create policy "avatars: reemplazo del propio dueño" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid() is not null);

create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin')
$$;

-- un admin puede editar (role/team_id) el perfil de cualquier
-- compañero de su mismo equipo, ej. sacarlo del equipo (team_id -> null)
create policy prof_admin_manage on profiles for update
  using (is_admin() and team_id = my_team_id())
  with check (is_admin() and (team_id = my_team_id() or team_id is null));
