-- Se fusiona Biblioteca dentro de "Página del equipo" (pestaña Archivos,
-- que junta los adjuntos de los avisos). Se elimina la herramienta aparte.

drop table if exists library_documents;
drop table if exists library_folders;

drop policy if exists "library docs: lectura publica" on storage.objects;
drop policy if exists "library docs: subida de staff" on storage.objects;
drop policy if exists "library docs: borrado de staff" on storage.objects;

-- el bucket 'library-docs' se deja: puede tener archivos ya subidos.
-- borrarlo a mano desde el panel de Storage si de verdad no se usó.
