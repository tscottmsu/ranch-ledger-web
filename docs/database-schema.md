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

## Future Tables

- trail_files
- live_locations
- emergency_events
- reports
- subscriptions
- audit_log