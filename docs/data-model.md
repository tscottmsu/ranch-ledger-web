# Ranch Ledger Data Model

This document defines the core business objects in Ranch Ledger before they are translated into database tables.

## Core Rule

Everything belongs to a ranch.

## Core Objects

- Ranch
- User
- Employee
- Guest
- Horse
- Trail
- Activity
- Ride Group
- Assignment
- Incident

# Ranch

## Description

A Ranch is the highest-level business object in Ranch Ledger.

Everything in the platform belongs to exactly one Ranch.

A Ranch represents a single customer using Ranch Ledger.

---

## Created By

Platform onboarding

or

Ranch Administrator during initial setup.

---

## Managed By

Ranch Administrator

---

## Used By

- Ranch Administrator
- Head Wrangler
- Wrangler
- Reports
- Operations

---

## Relationships

A Ranch owns:

- Employees
- Users
- Guests
- Horses
- Trails
- Activities
- Ride Groups
- Maps
- Incidents
- Reports

---

## Typical Information

- Ranch Name
- Physical Address
- Mailing Address
- Phone Number
- Email
- Website
- Time Zone
- Logo
- Emergency Contact Information
- GPS Location

---

## Notes

Every table in Ranch Ledger should ultimately reference a Ranch.

This is the primary tenant boundary for the platform.