create extension if not exists pgcrypto;

create table public.ranches (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique,
  phone text,
  email text,
  website text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country text default 'US',
  timezone text not null default 'America/Chicago',
  logo_url text,
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ranch_memberships (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('ranch_administrator', 'head_wrangler', 'wrangler', 'viewer')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ranch_id, user_id)
);

create index ranch_memberships_user_id_idx on public.ranch_memberships(user_id);
create index ranch_memberships_ranch_id_idx on public.ranch_memberships(ranch_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ranches_set_updated_at before update on public.ranches
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger ranch_memberships_set_updated_at before update on public.ranch_memberships
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.ranches enable row level security;
alter table public.profiles enable row level security;
alter table public.ranch_memberships enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Users can read their memberships"
on public.ranch_memberships for select to authenticated
using (user_id = (select auth.uid()));

create policy "Members can read their ranch"
on public.ranches for select to authenticated
using (
  exists (
    select 1 from public.ranch_memberships
    where ranch_memberships.ranch_id = ranches.id
      and ranch_memberships.user_id = (select auth.uid())
      and ranch_memberships.status = 'active'
  )
);

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

  return new_ranch_id;
end;
$$;

revoke all on function public.create_ranch_with_administrator(text, text, text, text, text) from public;
grant execute on function public.create_ranch_with_administrator(text, text, text, text, text) to authenticated;
