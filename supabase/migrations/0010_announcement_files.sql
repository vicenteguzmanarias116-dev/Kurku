-- kurku :: adjuntos en los avisos de la pagina del equipo

alter table announcements add column if not exists attachment_urls text[] not null default '{}';

insert into storage.buckets (id, name, public)
values ('announcement-files', 'announcement-files', true)
on conflict (id) do nothing;

create policy "announcement files: lectura publica" on storage.objects
  for select using (bucket_id = 'announcement-files');

create policy "announcement files: subida de staff" on storage.objects
  for insert with check (bucket_id = 'announcement-files' and is_staff());
