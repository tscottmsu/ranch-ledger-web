create table public.saddles (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  saddle_number text,
  type text,
  seat_size text,
  status text not null default 'active' check (status in ('active', 'inactive', 'repair', 'retired')),
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ranch_id, name)
);

create table public.reservation_guest_assignments (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  guest_id uuid not null references public.guests(id) on delete cascade,
  horse_id uuid references public.horses(id) on delete set null,
  saddle_id uuid references public.saddles(id) on delete set null,
  riding_ability text,
  notes text,
  assigned_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reservation_id, guest_id)
);

alter table public.ride_horse_assignments
add column saddle_id uuid references public.saddles(id) on delete set null;

create index saddles_ranch_id_idx on public.saddles(ranch_id);
create index saddles_status_idx on public.saddles(ranch_id, status) where archived_at is null;
create index reservation_guest_assignments_ranch_id_idx on public.reservation_guest_assignments(ranch_id);
create index reservation_guest_assignments_reservation_id_idx on public.reservation_guest_assignments(reservation_id);
create index reservation_guest_assignments_guest_id_idx on public.reservation_guest_assignments(guest_id);
create index reservation_guest_assignments_horse_id_idx on public.reservation_guest_assignments(horse_id);
create index reservation_guest_assignments_saddle_id_idx on public.reservation_guest_assignments(saddle_id);
create index ride_horse_assignments_saddle_id_idx on public.ride_horse_assignments(saddle_id);

create trigger saddles_set_updated_at before update on public.saddles
for each row execute function public.set_updated_at();
create trigger reservation_guest_assignments_set_updated_at before update on public.reservation_guest_assignments
for each row execute function public.set_updated_at();

create or replace function public.validate_saddle_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.saddle_id is not null and not exists (
    select 1 from public.saddles
    where id = new.saddle_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Saddle must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create or replace function public.validate_reservation_guest_assignment_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.reservations
    where id = new.reservation_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Reservation must belong to the same ranch.';
  end if;

  if not exists (
    select 1 from public.guests
    where id = new.guest_id and ranch_id = new.ranch_id and reservation_id = new.reservation_id
  ) then
    raise exception 'Guest must belong to the same reservation and ranch.';
  end if;

  if new.horse_id is not null and not exists (
    select 1 from public.horses
    where id = new.horse_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Horse must belong to the same ranch.';
  end if;

  if new.saddle_id is not null and not exists (
    select 1 from public.saddles
    where id = new.saddle_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Saddle must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create trigger reservation_guest_assignments_validate_ranch_relationships
before insert or update of ranch_id, reservation_id, guest_id, horse_id, saddle_id on public.reservation_guest_assignments
for each row execute function public.validate_reservation_guest_assignment_ranch_relationships();

create trigger ride_horse_assignments_validate_saddle_ranch_relationships
before insert or update of ranch_id, saddle_id on public.ride_horse_assignments
for each row execute function public.validate_saddle_ranch_relationships();

alter table public.saddles enable row level security;
alter table public.reservation_guest_assignments enable row level security;

grant select, insert, update on public.saddles to authenticated;
grant select, insert, update on public.reservation_guest_assignments to authenticated;

create policy "Members can read saddles" on public.saddles for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Operations managers can create saddles" on public.saddles for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update saddles" on public.saddles for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));

create policy "Members can read reservation guest assignments" on public.reservation_guest_assignments for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Operations managers can create reservation guest assignments" on public.reservation_guest_assignments for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update reservation guest assignments" on public.reservation_guest_assignments for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));

create policy "Operations managers can create guests for ride prep" on public.guests for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));
create policy "Operations managers can update guests for ride prep" on public.guests for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));
