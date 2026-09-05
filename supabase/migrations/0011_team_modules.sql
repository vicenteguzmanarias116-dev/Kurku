-- kurku :: el admin elige que herramientas aparecen en el nav del equipo
--
-- hidden_modules guarda las claves de las herramientas OCULTAS. Vacio =
-- todo visible. Una herramienta nueva aparece por defecto (aditivo).

alter table teams add column if not exists hidden_modules text[] not null default '{}';

create or replace function set_team_modules(p_hidden text[])
returns void
  language plpgsql security definer set search_path = public as $$
declare
  v_team_id uuid;
begin
  if not is_admin() then
    raise exception 'Solo el administrador.';
  end if;
  select team_id into v_team_id from profiles where id = auth.uid();
  update teams set hidden_modules = p_hidden where id = v_team_id;
end;
$$;
grant execute on function set_team_modules(text[]) to authenticated;
