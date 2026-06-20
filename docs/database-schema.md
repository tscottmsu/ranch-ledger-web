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

## Future Tables

- trail_files
- live_locations
- emergency_events
- reports
- subscriptions
- audit_log