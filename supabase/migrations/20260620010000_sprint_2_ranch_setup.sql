create or replace function public.is_active_ranch_member(target_ranch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.ranch_memberships
    where ranch_id = target_ranch_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_ranch_administrator(target_ranch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.ranch_memberships
    where ranch_id = target_ranch_id
      and user_id = auth.uid()
      and status = 'active'
      and role = 'ranch_administrator'
  );
$$;

revoke all on function public.is_active_ranch_member(uuid) from public;
revoke all on function public.is_ranch_administrator(uuid) from public;
grant execute on function public.is_active_ranch_member(uuid) to authenticated;
grant execute on function public.is_ranch_administrator(uuid) to authenticated;

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  first_name text not null check (char_length(trim(first_name)) > 0),
  last_name text not null check (char_length(trim(last_name)) > 0),
  nickname text,
  phone text,
  email text,
  position text,
  employment_status text not null default 'active' check (employment_status in ('active', 'inactive')),
  hire_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.horses (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  barn_name text,
  status text not null default 'active' check (status in ('active', 'inactive', 'retired', 'unavailable')),
  max_rider_weight_lbs integer check (max_rider_weight_lbs is null or max_rider_weight_lbs > 0),
  temperament text,
  experience_level text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trails (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  difficulty text,
  estimated_duration_minutes integer check (estimated_duration_minutes is null or estimated_duration_minutes > 0),
  description text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_types (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ranch_id, name)
);

alter table public.ranch_memberships
add column employee_id uuid references public.employees(id) on delete set null;

create index employees_ranch_id_idx on public.employees(ranch_id);
create index horses_ranch_id_idx on public.horses(ranch_id);
create index trails_ranch_id_idx on public.trails(ranch_id);
create index activity_types_ranch_id_idx on public.activity_types(ranch_id);

create trigger employees_set_updated_at before update on public.employees
for each row execute function public.set_updated_at();
create trigger horses_set_updated_at before update on public.horses
for each row execute function public.set_updated_at();
create trigger trails_set_updated_at before update on public.trails
for each row execute function public.set_updated_at();
create trigger activity_types_set_updated_at before update on public.activity_types
for each row execute function public.set_updated_at();

alter table public.employees enable row level security;
alter table public.horses enable row level security;
alter table public.trails enable row level security;
alter table public.activity_types enable row level security;

grant select, insert, update on public.employees to authenticated;
grant select, insert, update on public.horses to authenticated;
grant select, insert, update on public.trails to authenticated;
grant select, insert, update on public.activity_types to authenticated;

create policy "Members can read employees" on public.employees for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Administrators can create employees" on public.employees for insert to authenticated
with check (public.is_ranch_administrator(ranch_id));
create policy "Administrators can update employees" on public.employees for update to authenticated
using (public.is_ranch_administrator(ranch_id)) with check (public.is_ranch_administrator(ranch_id));

create policy "Members can read horses" on public.horses for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Administrators can create horses" on public.horses for insert to authenticated
with check (public.is_ranch_administrator(ranch_id));
create policy "Administrators can update horses" on public.horses for update to authenticated
using (public.is_ranch_administrator(ranch_id)) with check (public.is_ranch_administrator(ranch_id));

create policy "Members can read trails" on public.trails for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Administrators can create trails" on public.trails for insert to authenticated
with check (public.is_ranch_administrator(ranch_id));
create policy "Administrators can update trails" on public.trails for update to authenticated
using (public.is_ranch_administrator(ranch_id)) with check (public.is_ranch_administrator(ranch_id));

create policy "Members can read activity types" on public.activity_types for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Administrators can create activity types" on public.activity_types for insert to authenticated
with check (public.is_ranch_administrator(ranch_id));
create policy "Administrators can update activity types" on public.activity_types for update to authenticated
using (public.is_ranch_administrator(ranch_id)) with check (public.is_ranch_administrator(ranch_id));
