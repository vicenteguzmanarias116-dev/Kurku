-- Library: carpetas y documentos informativos (PDFs, imágenes, lo que sea)
-- que el staff sube y todo el equipo puede ver/descargar.
create table if not exists library_folders (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references teams(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists library_documents (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references teams(id) on delete cascade,
  folder_id  uuid references library_folders(id) on delete cascade, -- null = raíz
  title      text not null,
  file_url   text not null,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists library_documents_folder_idx on library_documents (folder_id);

alter table library_folders   enable row level security;
alter table library_documents enable row level security;

create policy lib_folders_read  on library_folders for select using (team_id = my_team_id());
create policy lib_folders_write on library_folders for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());

create policy lib_docs_read  on library_documents for select using (team_id = my_team_id());
create policy lib_docs_write on library_documents for all
  using (is_staff() and team_id = my_team_id())
  with check (is_staff() and team_id = my_team_id());

insert into storage.buckets (id, name, public)
values ('library-docs', 'library-docs', true)
on conflict (id) do nothing;

create policy "library docs: lectura publica" on storage.objects
  for select using (bucket_id = 'library-docs');

create policy "library docs: subida de staff" on storage.objects
  for insert with check (bucket_id = 'library-docs' and is_staff());

create policy "library docs: borrado de staff" on storage.objects
  for delete using (bucket_id = 'library-docs' and is_staff());
