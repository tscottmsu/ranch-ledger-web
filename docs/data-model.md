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

# Reservation

## Description

A Reservation is an optional grouping container for one or more Guests.

Reservations are useful for families, parties, corporate groups, retreats, and other groups arriving together.

A Guest may belong to a Reservation, but this is not required.

---

## Created By

Ranch Administrator

---

## Managed By

Ranch Administrator

---

## Used By

- Ranch Administrator
- Head Wrangler
- Reports
- Operations

---

## Relationships

A Reservation belongs to one Ranch.

A Reservation may contain many Guests.

A Guest may optionally belong to one Reservation.

---

## Typical Information

- Reservation Name
- Primary Contact Name
- Primary Contact Phone
- Primary Contact Email
- Arrival Date
- Departure Date
- Cabin/Lodging Notes
- Group Notes
- Status

---

## Notes

Reservations help the Administrator manage groups of guests while still allowing the Head Wrangler to assign individual guests to activities.

# Guest

## Description

A Guest is an individual person staying at or visiting the ranch.

Guests are records first, not login users.

A Guest may belong to a Reservation, but does not have to.

---

## Created By

Ranch Administrator

---

## Managed By

Ranch Administrator

---

## Used By

- Ranch Administrator
- Head Wrangler
- Wrangler
- Operations
- Reports

---

## Relationships

A Guest belongs to one Ranch.

A Guest may optionally belong to one Reservation.

A Guest may be assigned to many Activities.

A Guest may be assigned to different Horses over time.

A Guest has ride/activity history.

---

## Typical Information

- First Name
- Last Name
- Nickname
- Age
- Phone
- Emergency Contact Name
- Emergency Contact Phone
- Arrival Date
- Departure Date
- Riding Experience
- Weight
- Medical Notes
- Special Notes
- Status

---

## Guest Statuses

- Reserved
- Checked In
- Ready for Assignment
- Assigned
- In Activity
- Completed
- Checked Out

---

## Notes

The Head Wrangler should only see Guests relevant to current operations, such as Guests who are checked in, ready for assignment, or currently assigned to an activity.

Guest login may be added later, but it is not part of the MVP.