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

## Future Tables

- trail_files
- live_locations
- emergency_events
- reports
- subscriptions
- audit_log