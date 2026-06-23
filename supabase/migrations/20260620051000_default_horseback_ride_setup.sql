insert into public.activity_types (ranch_id, name, description, active)
select id, 'Horseback Ride', 'Default ride setup used by Ranch Ledger ride operations.', true
from public.ranches
on conflict (ranch_id, name) do update
set active = true,
    description = coalesce(public.activity_types.description, excluded.description),
    updated_at = now();

create or replace function public.ensure_default_horseback_ride_setup(target_ranch_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  setup_id uuid;
begin
  if not public.can_manage_daily_operations(target_ranch_id) then
    raise exception 'Ride Operations access is required.';
  end if;

  insert into public.activity_types (ranch_id, name, description, active)
  values (target_ranch_id, 'Horseback Ride', 'Default ride setup used by Ranch Ledger ride operations.', true)
  on conflict (ranch_id, name) do update
  set active = true,
      description = coalesce(public.activity_types.description, excluded.description),
      updated_at = now()
  returning id into setup_id;

  return setup_id;
end;
$$;

revoke all on function public.ensure_default_horseback_ride_setup(uuid) from public;
grant execute on function public.ensure_default_horseback_ride_setup(uuid) to authenticated;

create or replace function public.create_ranch_with_administrator(
  ranch_name text,
  ranch_phone text default null,
  ranch_email text default null,
  ranch_address text default null,
  ranch_timezone text default 'America/Chicago'
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  new_ranch_id uuid;
  base_slug text;
  available_slug text;
begin
  if current_user_id is null then
    raise exception 'Authentication is required.';
  end if;
  if nullif(trim(ranch_name), '') is null then
    raise exception 'Ranch name is required.';
  end if;

  insert into public.profiles (id)
  values (current_user_id)
  on conflict (id) do nothing;

  base_slug := trim(both '-' from regexp_replace(lower(trim(ranch_name)), '[^a-z0-9]+', '-', 'g'));
  if base_slug = '' then base_slug := 'ranch'; end if;
  available_slug := base_slug;
  while exists (select 1 from public.ranches where slug = available_slug) loop
    available_slug := base_slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  end loop;

  insert into public.ranches (name, slug, phone, email, address_line_1, timezone)
  values (trim(ranch_name), available_slug, nullif(trim(ranch_phone), ''), nullif(trim(ranch_email), ''), nullif(trim(ranch_address), ''), ranch_timezone)
  returning id into new_ranch_id;

  insert into public.ranch_memberships (ranch_id, user_id, role)
  values (new_ranch_id, current_user_id, 'ranch_administrator');

  insert into public.activity_types (ranch_id, name, description, active)
  values (new_ranch_id, 'Horseback Ride', 'Default ride setup used by Ranch Ledger ride operations.', true)
  on conflict (ranch_id, name) do update
  set active = true,
      description = coalesce(public.activity_types.description, excluded.description),
      updated_at = now();

  return new_ranch_id;
end;
$$;

revoke all on function public.create_ranch_with_administrator(text, text, text, text, text) from public;
grant execute on function public.create_ranch_with_administrator(text, text, text, text, text) to authenticated;
