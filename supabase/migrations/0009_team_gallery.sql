-- kurku :: galeria de fotos del equipo (personalizacion de "Pagina del
-- equipo"), unicamente editable por el admin

alter table teams add column if not exists gallery_urls text[] not null default '{}';

insert into storage.buckets (id, name, public)
values ('team-gallery', 'team-gallery', true)
on conflict (id) do nothing;

create policy "team gallery: lectura publica" on storage.objects
  for select using (bucket_id = 'team-gallery');

create policy "team gallery: subida de admin" on storage.objects
  for insert with check (bucket_id = 'team-gallery' and is_admin());

create policy "team gallery: borrado de admin" on storage.objects
  for delete using (bucket_id = 'team-gallery' and is_admin());

create or replace function set_team_gallery(p_urls text[])
returns void
  language plpgsql security definer set search_path = public as $$
declare
  v_team_id uuid;
begin
  if not is_admin() then
    raise exception 'Solo el administrador.';
  end if;
  select team_id into v_team_id from profiles where id = auth.uid();
  update teams set gallery_urls = p_urls where id = v_team_id;
end;
$$;
grant execute on function set_team_gallery(text[]) to authenticated;
