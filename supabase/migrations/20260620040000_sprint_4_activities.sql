create or replace function public.can_manage_daily_operations(target_ranch_id uuid)
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
      and role in ('ranch_administrator', 'head_wrangler')
  );
$$;

revoke all on function public.can_manage_daily_operations(uuid) from public;
grant execute on function public.can_manage_daily_operations(uuid) to authenticated;

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.ranches(id) on delete cascade,
  activity_type_id uuid not null references public.activity_types(id) on delete restrict,
  trail_id uuid references public.trails(id) on delete set null,
  name text,
  activity_date date not null,
  start_time time,
  end_time time,
  status text not null default 'draft' check (status in ('draft', 'ready', 'in_progress', 'completed', 'cancelled')),
  capacity integer check (capacity is null or capacity > 0),
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or start_time is null or end_time > start_time)
);

create index activities_ranch_date_idx on public.activities(ranch_id, activity_date);
create index activities_ranch_status_idx on public.activities(ranch_id, status) where archived_at is null;

create trigger activities_set_updated_at before update on public.activities
for each row execute function public.set_updated_at();

create or replace function public.validate_activity_ranch_relationships()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.activity_types
    where id = new.activity_type_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Activity type must belong to the same ranch.';
  end if;

  if new.trail_id is not null and not exists (
    select 1 from public.trails
    where id = new.trail_id and ranch_id = new.ranch_id
  ) then
    raise exception 'Trail must belong to the same ranch.';
  end if;

  return new;
end;
$$;

create trigger activities_validate_ranch_relationships
before insert or update of ranch_id, activity_type_id, trail_id on public.activities
for each row execute function public.validate_activity_ranch_relationships();

alter table public.activities enable row level security;
grant select, insert, update on public.activities to authenticated;

create policy "Members can read activities" on public.activities for select to authenticated
using (public.is_active_ranch_member(ranch_id));

create policy "Operations managers can create activities" on public.activities for insert to authenticated
with check (public.can_manage_daily_operations(ranch_id));

create policy "Operations managers can update activities" on public.activities for update to authenticated
using (public.can_manage_daily_operations(ranch_id))
with check (public.can_manage_daily_operations(ranch_id));
