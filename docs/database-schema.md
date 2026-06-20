# Ranch Ledger Database Schema

This document translates the Ranch Ledger data model into Supabase/Postgres tables.

## Schema Rules

1. Every operational table should include `ranch_id`.
2. `ranch_id` is the tenant boundary.
3. Users authenticate through Supabase Auth.
4. Employees are ranch staff records and may or may not have login access.
5. Guests are records first and do not require login access.
6. Software roles belong to ranch memberships, not employee positions.
7. Tables should be designed for Row Level Security from the beginning.

## Core Tables

- ranches
- profiles
- ranch_memberships
- employees
- reservations
- guests
- horses
- trails
- activity_types
- activities
- activity_guest_assignments
- activity_employee_assignments
- activity_horse_assignments
- incidents

## Table: ranches

Purpose:
Stores one ranch/customer tenant.

Columns:
- id uuid primary key default gen_random_uuid()
- name text not null
- slug text not null unique
- phone text
- email text
- website text
- address_line_1 text
- address_line_2 text
- city text
- state text
- postal_code text
- country text default 'US'
- timezone text not null default 'America/Chicago'
- logo_url text
- emergency_contact_name text
- emergency_contact_phone text
- created_at timestamptz default now()
- updated_at timestamptz default now()

Notes:
Every operational table references `ranches.id`.

## Table: profiles

Purpose:
Stores app profile data for Supabase Auth users.

Columns:
- id uuid primary key references auth.users(id) on delete cascade
- first_name text
- last_name text
- phone text
- avatar_url text
- created_at timestamptz default now()
- updated_at timestamptz default now()

Notes:
This table extends Supabase Auth.

## Table: ranch_memberships

Purpose:
Connects a user to a ranch and controls software permissions.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- user_id uuid not null references profiles(id) on delete cascade
- employee_id uuid references employees(id) on delete set null
- role text not null
- status text not null default 'active'
- created_at timestamptz default now()
- updated_at timestamptz default now()

Roles:
- ranch_administrator
- head_wrangler
- wrangler
- viewer

Constraints:
- unique(ranch_id, user_id)

Notes:
Software roles live here, not on employees.

## Table: employees

Purpose:
Stores ranch staff records. Employees may or may not have login access.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- first_name text not null
- last_name text not null
- nickname text
- phone text
- email text
- position text
- employment_status text not null default 'active'
- hire_date date
- notes text
- created_at timestamptz default now()
- updated_at timestamptz default now()

Notes:
Employee position is not the same as software role.

## Table: reservations

Purpose:
Groups guests together under a reservation, party, family, or group.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- reservation_name text
- primary_contact_name text
- primary_contact_phone text
- primary_contact_email text
- arrival_date date
- departure_date date
- cabin_or_lodging_notes text
- group_notes text
- status text not null default 'reserved'
- created_at timestamptz default now()
- updated_at timestamptz default now()

## Table: guests

Purpose:
Stores individual guests. Guests are records first and do not require login access.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- reservation_id uuid references reservations(id) on delete set null
- first_name text not null
- last_name text not null
- nickname text
- age integer
- phone text
- emergency_contact_name text
- emergency_contact_phone text
- arrival_date date
- departure_date date
- riding_experience text
- weight_lbs integer
- medical_notes text
- special_notes text
- status text not null default 'reserved'
- created_at timestamptz default now()
- updated_at timestamptz default now()

Statuses:
- reserved
- checked_in
- ready_for_assignment
- assigned
- in_activity
- completed
- checked_out

## Table: horses

Purpose:
Stores horses that can be assigned to guided rides.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- name text not null
- barn_name text
- status text not null default 'active'
- max_rider_weight_lbs integer
- temperament text
- experience_level text
- notes text
- created_at timestamptz default now()
- updated_at timestamptz default now()

Statuses:
- active
- inactive
- retired
- unavailable

## Table: trails

Purpose:
Stores trails/routes used for guided rides and future mapped activities.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- name text not null
- difficulty text
- estimated_duration_minutes integer
- description text
- notes text
- active boolean not null default true
- created_at timestamptz default now()
- updated_at timestamptz default now()

Notes:
Trail file uploads and GPS geometry will be added later.

## Table: activity_types

Purpose:
Defines the types of activities a ranch offers.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- name text not null
- description text
- active boolean not null default true
- created_at timestamptz default now()
- updated_at timestamptz default now()

Examples:
- Guided Ride
- Fishing Trip
- Guided Hike
- Wagon Ride

Notes:
Guided Ride is the first MVP activity type.

## Table: activities

Purpose:
Stores scheduled ranch activities such as guided rides, fishing trips, hikes, and wagon rides.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_type_id uuid not null references activity_types(id) on delete restrict
- trail_id uuid references trails(id) on delete set null
- name text
- activity_date date not null
- start_time time
- end_time time
- status text not null default 'draft'
- capacity integer
- notes text
- created_by uuid references profiles(id) on delete set null
- created_at timestamptz default now()
- updated_at timestamptz default now()

Statuses:
- draft
- preparing
- ready
- active
- completed
- cancelled

Notes:
Guided rides are activities. The assigned guests, employees, and horses are stored in assignment tables.

## Table: activity_guest_assignments

Purpose:
Assigns guests to activities.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_id uuid not null references activities(id) on delete cascade
- guest_id uuid not null references guests(id) on delete cascade
- status text not null default 'assigned'
- notes text
- created_at timestamptz default now()
- updated_at timestamptz default now()

Statuses:
- assigned
- present
- no_show
- completed
- removed

Constraints:
- unique(activity_id, guest_id)

## Table: activity_employee_assignments

Purpose:
Assigns employees to activities.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_id uuid not null references activities(id) on delete cascade
- employee_id uuid not null references employees(id) on delete cascade
- assignment_role text
- status text not null default 'assigned'
- notes text
- created_at timestamptz default now()
- updated_at timestamptz default now()

Examples:
- lead_wrangler
- assistant_wrangler
- guide

Constraints:
- unique(activity_id, employee_id)

## Table: activity_horse_assignments

Purpose:
Assigns horses to guests for a specific activity.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_id uuid not null references activities(id) on delete cascade
- guest_id uuid references guests(id) on delete set null
- horse_id uuid not null references horses(id) on delete cascade
- status text not null default 'assigned'
- notes text
- created_at timestamptz default now()
- updated_at timestamptz default now()

Constraints:
- unique(activity_id, horse_id)
- unique(activity_id, guest_id)

Notes:
Horse assignments are activity-specific, not permanently tied to the guest.

## Table: assignment_checks

Purpose:
Stores warnings and blocking issues found when building an activity assignment.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_id uuid not null references activities(id) on delete cascade
- check_type text not null
- severity text not null
- message text not null
- related_guest_id uuid references guests(id) on delete set null
- related_employee_id uuid references employees(id) on delete set null
- related_horse_id uuid references horses(id) on delete set null
- related_trail_id uuid references trails(id) on delete set null
- resolved boolean not null default false
- resolved_by uuid references profiles(id) on delete set null
- resolved_at timestamptz
- created_at timestamptz default now()

Severities:
- pass
- warning
- block

Examples:
- Guest already rode this trail.
- Guest experience may be too low.
- Horse already assigned.
- Wrangler already assigned.
- Horse exceeds rider weight limit.

## Table: incidents

Purpose:
Stores safety, operational, medical, or behavior incidents tied to an activity, guest, employee, horse, or trail.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_id uuid references activities(id) on delete set null
- guest_id uuid references guests(id) on delete set null
- employee_id uuid references employees(id) on delete set null
- horse_id uuid references horses(id) on delete set null
- trail_id uuid references trails(id) on delete set null
- incident_type text
- severity text
- title text not null
- description text
- occurred_at timestamptz
- reported_by uuid references profiles(id) on delete set null
- created_at timestamptz default now()
- updated_at timestamptz default now()

Examples:
- Medical issue
- Horse behavior
- Guest behavior
- Trail hazard
- Equipment issue
- Late return

## Table: live_locations

Purpose:
Stores live GPS location updates from field staff during active activities.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_id uuid references activities(id) on delete cascade
- employee_id uuid references employees(id) on delete set null
- user_id uuid references profiles(id) on delete set null
- latitude numeric not null
- longitude numeric not null
- accuracy_meters numeric
- heading numeric
- speed_mps numeric
- recorded_at timestamptz not null default now()
- created_at timestamptz default now()

Notes:
Used by the future Field App for live tracking.

## Table: emergency_events

Purpose:
Stores emergency beacon events triggered from the Field App.

Columns:
- id uuid primary key default gen_random_uuid()
- ranch_id uuid not null references ranches(id) on delete cascade
- activity_id uuid references activities(id) on delete set null
- employee_id uuid references employees(id) on delete set null
- user_id uuid references profiles(id) on delete set null
- status text not null default 'active'
- latitude numeric
- longitude numeric
- message text
- triggered_at timestamptz not null default now()
- resolved_by uuid references profiles(id) on delete set null
- resolved_at timestamptz
- created_at timestamptz default now()
- updated_at timestamptz default now()

Statuses:
- active
- acknowledged
- resolved
- false_alarm

Notes:
When active, this should put the Operations map into emergency mode.

## Future Tables

- trail_files
- live_locations
- emergency_events
- reports
- subscriptions
- audit_log