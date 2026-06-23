alter table public.reservations
drop constraint if exists reservations_status_check;

alter table public.reservations
add constraint reservations_status_check
check (status in ('reserved', 'confirmed', 'checked_in', 'checked_out', 'completed', 'cancelled', 'archived'));

create or replace function public.cascade_reservation_status_to_guests()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.status is distinct from old.status and new.status in ('checked_in', 'checked_out', 'archived') then
    update public.guests
    set status = new.status
    where reservation_id = new.id and ranch_id = new.ranch_id;
  end if;
  return new;
end;
$$;

drop trigger if exists reservations_cascade_status_to_guests on public.reservations;
create trigger reservations_cascade_status_to_guests
after update of status on public.reservations
for each row execute function public.cascade_reservation_status_to_guests();

create or replace function public.save_reservation_with_guests(
  target_ranch_id uuid,
  target_reservation_id uuid,
  new_reservation_name text,
  new_primary_contact_name text,
  new_primary_contact_phone text,
  new_primary_contact_email text,
  new_arrival_date date,
  new_departure_date date,
  new_cabin_or_lodging_notes text,
  new_group_notes text,
  new_status text,
  new_guests jsonb
)
returns uuid
language plpgsql
set search_path = public, pg_temp
as $$
declare
  saved_reservation_id uuid;
  initial_guest_status text;
begin
  if not public.is_ranch_administrator(target_ranch_id) then
    raise exception 'Ranch Administrator access is required.';
  end if;

  if target_reservation_id is null then
    insert into public.reservations (
      ranch_id, reservation_name, primary_contact_name, primary_contact_phone,
      primary_contact_email, arrival_date, departure_date,
      cabin_or_lodging_notes, group_notes, status
    ) values (
      target_ranch_id, new_reservation_name, new_primary_contact_name,
      new_primary_contact_phone, new_primary_contact_email, new_arrival_date,
      new_departure_date, new_cabin_or_lodging_notes, new_group_notes, new_status
    ) returning id into saved_reservation_id;
  else
    update public.reservations set
      reservation_name = new_reservation_name,
      primary_contact_name = new_primary_contact_name,
      primary_contact_phone = new_primary_contact_phone,
      primary_contact_email = new_primary_contact_email,
      arrival_date = new_arrival_date,
      departure_date = new_departure_date,
      cabin_or_lodging_notes = new_cabin_or_lodging_notes,
      group_notes = new_group_notes,
      status = new_status
    where id = target_reservation_id and ranch_id = target_ranch_id
    returning id into saved_reservation_id;

    if saved_reservation_id is null then
      raise exception 'Reservation not found.';
    end if;
  end if;

  initial_guest_status := case
    when new_status in ('checked_in', 'checked_out', 'archived') then new_status
    else 'reserved'
  end;

  insert into public.guests (ranch_id, reservation_id, first_name, last_name, status)
  select target_ranch_id, saved_reservation_id, trim(guest.first_name), trim(guest.last_name), initial_guest_status
  from jsonb_to_recordset(coalesce(new_guests, '[]'::jsonb)) as guest(first_name text, last_name text)
  where nullif(trim(guest.first_name), '') is not null
    and nullif(trim(guest.last_name), '') is not null;

  return saved_reservation_id;
end;
$$;

revoke all on function public.save_reservation_with_guests(uuid, uuid, text, text, text, text, date, date, text, text, text, jsonb) from public;
grant execute on function public.save_reservation_with_guests(uuid, uuid, text, text, text, text, date, date, text, text, text, jsonb) to authenticated;
