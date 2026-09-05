-- kurku :: bucket para fotos de atleta, subida por archivo

insert into storage.buckets (id, name, public)
values ('athlete-photos', 'athlete-photos', true)
on conflict (id) do nothing;

create policy "athlete photos: lectura publica" on storage.objects
  for select using (bucket_id = 'athlete-photos');

create policy "athlete photos: subida de staff" on storage.objects
  for insert with check (bucket_id = 'athlete-photos' and is_staff());
