-- Lista pública de equipos (solo nombre y logo) para el globo del landing.
-- No expone nada sensible: ni ubicación real, ni miembros, ni datos internos.
create or replace function public_teams_directory()
returns table (id uuid, name text, logo_url text)
language sql stable security definer set search_path = public as $$
  select id, name, logo_url from teams where logo_url is not null order by created_at asc;
$$;

grant execute on function public_teams_directory() to anon, authenticated;
