create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  reservation_name text,
  primary_contact_name text,
  primary_contact_phone text,
  primary_contact_email text,
  arrival_date date,
  departure_date date,
  cabin_or_lodging_notes text,
  group_notes text,
  status text not null default 'reserved' check (status in ('reserved', 'confirmed', 'checked_in', 'completed', 'cancelled', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (departure_date is null or arrival_date is null or departure_date >= arrival_date)
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  first_name text not null check (char_length(trim(first_name)) > 0),
  last_name text not null check (char_length(trim(last_name)) > 0),
  nickname text,
  age integer check (age is null or age between 0 and 125),
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  arrival_date date,
  departure_date date,
  riding_experience text,
  weight_lbs integer check (weight_lbs is null or weight_lbs > 0),
  medical_notes text,
  special_notes text,
  status text not null default 'reserved' check (status in ('reserved', 'checked_in', 'ready_for_assignment', 'assigned', 'in_activity', 'completed', 'checked_out', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (departure_date is null or arrival_date is null or departure_date >= arrival_date)
);

create index reservations_ranch_id_idx on public.reservations(ranch_id);
create index reservations_status_idx on public.reservations(ranch_id, status);
create index guests_ranch_id_idx on public.guests(ranch_id);
create index guests_reservation_id_idx on public.guests(reservation_id);
create index guests_status_idx on public.guests(ranch_id, status);

create trigger reservations_set_updated_at before update on public.reservations
for each row execute function public.set_updated_at();
create trigger guests_set_updated_at before update on public.guests
for each row execute function public.set_updated_at();

create or replace function public.validate_guest_reservation_ranch()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.reservation_id is not null and not exists (
    select 1 from public.reservations
    where id = new.reservation_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Guest reservation must belong to the same ranch.';
  end if;
  return new;
end;
$$;

create trigger guests_validate_reservation_ranch
before insert or update of ranch_id, reservation_id on public.guests
for each row execute function public.validate_guest_reservation_ranch();

alter table public.reservations enable row level security;
alter table public.guests enable row level security;

grant select, insert, update on public.reservations to authenticated;
grant select, insert, update on public.guests to authenticated;

create policy "Members can read reservations" on public.reservations for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Administrators can create reservations" on public.reservations for insert to authenticated
with check (public.is_ranch_administrator(ranch_id));
create policy "Administrators can update reservations" on public.reservations for update to authenticated
using (public.is_ranch_administrator(ranch_id)) with check (public.is_ranch_administrator(ranch_id));

create policy "Members can read guests" on public.guests for select to authenticated
using (public.is_active_ranch_member(ranch_id));
create policy "Administrators can create guests" on public.guests for insert to authenticated
with check (public.is_ranch_administrator(ranch_id));
create policy "Administrators can update guests" on public.guests for update to authenticated
using (public.is_ranch_administrator(ranch_id)) with check (public.is_ranch_administrator(ranch_id));
