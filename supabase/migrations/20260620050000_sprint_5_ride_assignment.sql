create table public.rides (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  activity_type_id uuid not null references public.activity_types(id) on delete restrict,
  trail_id uuid references public.trails(id) on delete set null,
  name text not null check (char_length(trim(name)) > 0),
  ride_date date not null,
  start_time time,
  end_time time,
  status text not null default 'draft' check (status in ('draft', 'assigning', 'ready', 'active', 'completed', 'cancelled')),
  capacity integer check (capacity is null or capacity > 0),
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or start_time is null or end_time > start_time)
);

create table public.ride_guests (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  ride_id uuid not null references public.rides(id) on delete cascade,
  guest_id uuid not null references public.guests(id) on delete restrict,
  reservation_id uuid references public.reservations(id) on delete set null,
  status text not null default 'assigned' check (status in ('assigned', 'checked_in', 'removed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ride_id, guest_id)
);

create table public.ride_horse_assignments (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  ride_id uuid not null references public.rides(id) on delete cascade,
  ride_guest_id uuid not null references public.ride_guests(id) on delete cascade,
  horse_id uuid not null references public.horses(id) on delete restrict,
  assigned_by uuid references public.profiles(id) on delete set null default auth.uid(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ride_guest_id),
  unique (ride_id, horse_id)
);

create table public.ride_wrangler_assignments (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  ride_id uuid not null references public.rides(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete restrict,
  role text not null default 'assistant' check (role in ('lead', 'assistant')),
  assigned_by uuid references public.profiles(id) on delete set null default auth.uid(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ride_id, employee_id)
);

create table public.ride_validation_warnings (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  ride_id uuid not null references public.rides(id) on delete cascade,
  severity text not null check (severity in ('info', 'warning', 'blocking')),
  code text not null check (char_length(trim(code)) > 0),
  title text not null check (char_length(trim(title)) > 0),
  message text,
  subject_type text,
  subject_id uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index rides_ranch_id_idx on public.rides(ranch_id);
create index rides_ranch_date_idx on public.rides(ranch_id, ride_date);
create index rides_ranch_status_idx on public.rides(ranch_id, status);
create index rides_activity_type_id_idx on public.rides(activity_type_id);
create index rides_trail_id_idx on public.rides(trail_id);

create index ride_guests_ranch_id_idx on public.ride_guests(ranch_id);
create index ride_guests_ride_id_idx on public.ride_guests(ride_id);
create index ride_guests_guest_id_idx on public.ride_guests(guest_id);
create index ride_guests_reservation_id_idx on public.ride_guests(reservation_id);
create index ride_guests_status_idx on public.ride_guests(ranch_id, status);

create index ride_horse_assignments_ranch_id_idx on public.ride_horse_assignments(ranch_id);
create index ride_horse_assignments_ride_id_idx on public.ride_horse_assignments(ride_id);
create index ride_horse_assignments_horse_id_idx on public.ride_horse_assignments(horse_id);
create index ride_horse_assignments_ride_guest_id_idx on public.ride_horse_assignments(ride_guest_id);

create index ride_wrangler_assignments_ranch_id_idx on public.ride_wrangler_assignments(ranch_id);
create index ride_wrangler_assignments_ride_id_idx on public.ride_wrangler_assignments(ride_id);
create index ride_wrangler_assignments_employee_id_idx on public.ride_wrangler_assignments(employee_id);
create unique index ride_wrangler_assignments_one_lead_idx
on public.ride_wrangler_assignments(ride_id)
where role = 'lead';

create index ride_validation_warnings_ranch_id_idx on public.ride_validation_warnings(ranch_id);
create index ride_validation_warnings_ride_id_idx on public.ride_validation_warnings(ride_id);
create index ride_validation_warnings_status_idx on public.ride_validation_warnings(ranch_id, severity)
where resolved_at is null;
create unique index ride_validation_warnings_open_subject_idx
on public.ride_validation_warnings(ride_id, code, subject_type, subject_id)
where resolved_at is null and subject_type is not null and subject_id is not null;

create trigger rides_set_updated_at before update on public.rides
for each row execute function public.set_updated_at();
create trigger ride_guests_set_updated_at before update on public.ride_guests
for each row execute function public.set_updated_at();
create trigger ride_horse_assignments_set_updated_at before update on public.ride_horse_assignments
for each row execute function public.set_updated_at();
create trigger ride_wrangler_assignments_set_updated_at before update on public.ride_wrangler_assignments
for each row execute function public.set_updated_at();
create trigger ride_validation_warnings_set_updated_at before update on public.ride_validation_warnings
for each row execute function public.set_updated_at();

create or replace function public.validate_ride_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.activity_types
    where id = new.activity_type_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Ride activity type must belong to the same ranch.';
  end if;

  if new.trail_id is not null and not exists (
    select 1 from public.trails
    where id = new.trail_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Ride trail must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create trigger rides_validate_ranch_relationships
before insert or update of ranch_id, activity_type_id, trail_id on public.rides
for each row execute function public.validate_ride_ranch_relationships();

create or replace function public.validate_ride_guest_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.rides
    where id = new.ride_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Ride guest ride must belong to the same ranch.';
  end if;

  if not exists (
    select 1 from public.guests
    where id = new.guest_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Ride guest must belong to the same ranch.';
  end if;

  if new.reservation_id is not null and not exists (
    select 1 from public.reservations
    where id = new.reservation_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Ride guest reservation must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create trigger ride_guests_validate_ranch_relationships
before insert or update of ranch_id, ride_id, guest_id, reservation_id on public.ride_guests
for each row execute function public.validate_ride_guest_ranch_relationships();

create or replace function public.validate_ride_horse_assignment_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.rides
    where id = new.ride_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Horse assignment ride must belong to the same ranch.';
  end if;

  if not exists (
    select 1 from public.ride_guests
    where id = new.ride_guest_id and ride_id = new.ride_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Horse assignment ride guest must belong to the same ride and ranch.';
  end if;

  if not exists (
    select 1 from public.horses
    where id = new.horse_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Horse assignment horse must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create trigger ride_horse_assignments_validate_ranch_relationships
before insert or update of ranch_id, ride_id, ride_guest_id, horse_id on public.ride_horse_assignments
for each row execute function public.validate_ride_horse_assignment_ranch_relationships();

create or replace function public.validate_ride_wrangler_assignment_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.rides
    where id = new.ride_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Wrangler assignment ride must belong to the same ranch.';
  end if;

  if not exists (
    select 1 from public.employees
    where id = new.employee_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Wrangler assignment employee must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create trigger ride_wrangler_assignments_validate_ranch_relationships
before insert or update of ranch_id, ride_id, employee_id on public.ride_wrangler_assignments
for each row execute function public.validate_ride_wrangler_assignment_ranch_relationships();

create or replace function public.validate_ride_warning_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.rides
    where id = new.ride_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Ride warning ride must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create trigger ride_validation_warnings_validate_ranch_relationships
before insert or update of ranch_id, ride_id on public.ride_validation_warnings
for each row execute function public.validate_ride_warning_ranch_relationships();

create or replace function public.enforce_ride_ready_requirements()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.status <> 'ready' then
    return new;
  end if;

  if new.trail_id is null then
    raise exception 'A ride needs a trail before it can be marked ready.';
  end if;

  if not exists (
    select 1 from public.ride_guests
    where ride_id = new.id and ranch_id = new.ranch_id and status <> 'removed'
  ) then
    raise exception 'A ride needs at least one guest before it can be marked ready.';
  end if;

  if exists (
    select 1
    from public.ride_guests ride_guest
    where ride_guest.ride_id = new.id
      and ride_guest.ranch_id = new.ranch_id
      and ride_guest.status <> 'removed'
      and not exists (
        select 1 from public.ride_horse_assignments horse_assignment
        where horse_assignment.ride_guest_id = ride_guest.id
          and horse_assignment.ride_id = new.id
          and horse_assignment.ranch_id = new.ranch_id
      )
  ) then
    raise exception 'Every active ride guest needs a horse before the ride can be marked ready.';
  end if;

  if not exists (
    select 1 from public.ride_wrangler_assignments
    where ride_id = new.id and ranch_id = new.ranch_id
  ) then
    raise exception 'A ride needs a wrangler before it can be marked ready.';
  end if;

  if exists (
    select 1 from public.ride_validation_warnings
    where ride_id = new.id
      and ranch_id = new.ranch_id
      and severity = 'blocking'
      and resolved_at is null
  ) then
    raise exception 'Blocking ride warnings must be resolved before the ride can be marked ready.';
  end if;

  return new;
end;
$$;

create trigger rides_enforce_ready_requirements
before insert or update of status on public.rides
for each row execute function public.enforce_ride_ready_requirements();

alter table public.rides enable row level security;
alter table public.ride_guests enable row level security;
alter table public.ride_horse_assignments enable row level security;
alter table public.ride_wrangler_assignments enable row level security;
alter table public.ride_validation_warnings enable row level security;

grant select, insert, update on public.rides to authenticated;
grant select, insert, update on public.ride_guests to authenticated;
grant select, insert, update on public.ride_horse_assignments to authenticated;
grant select, insert, update on public.ride_wrangler_assignments to authenticated;
grant select, insert, update on public.ride_validation_warnings to authenticated;

create policy "Members can read rides" on public.rides for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Operations managers can create rides" on public.rides for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update rides" on public.rides for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));

create policy "Members can read ride guests" on public.ride_guests for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Operations managers can create ride guests" on public.ride_guests for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update ride guests" on public.ride_guests for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));

create policy "Members can read ride horse assignments" on public.ride_horse_assignments for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Operations managers can create ride horse assignments" on public.ride_horse_assignments for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update ride horse assignments" on public.ride_horse_assignments for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));

create policy "Members can read ride wrangler assignments" on public.ride_wrangler_assignments for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Operations managers can create ride wrangler assignments" on public.ride_wrangler_assignments for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update ride wrangler assignments" on public.ride_wrangler_assignments for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));

create policy "Members can read ride validation warnings" on public.ride_validation_warnings for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Operations managers can create ride validation warnings" on public.ride_validation_warnings for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update ride validation warnings" on public.ride_validation_warnings for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));
