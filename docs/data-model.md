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

# Employee

## Description

An Employee is a ranch staff member.

Employees are operational records and do not automatically receive login access.

An Employee may optionally be linked to a User account if they require access to Ranch Ledger.

---

## Created By

Ranch Administrator

---

## Managed By

Ranch Administrator

Head Wrangler (limited operational fields)

---

## Used By

- Ranch Administrator
- Head Wrangler
- Operations
- Reports

---

## Relationships

An Employee belongs to one Ranch.

An Employee may optionally have one User account.

An Employee may lead many Activities.

An Employee may have certifications.

An Employee may have a work schedule.

---

## Typical Information

- First Name
- Last Name
- Nickname
- Phone
- Email
- Position
- Employment Status
- Hire Date
- Notes

---

## Employee Positions

Examples:

- Head Wrangler
- Wrangler
- Assistant Wrangler
- Fishing Guide
- Hiking Guide
- Ranch Manager
- Office Staff
- Maintenance

---

## Operational Information

Employees may have:

- Certifications
- Trail Qualifications
- Activity Qualifications
- Availability
- Work Schedule

---

## Login Access

Employees are not required to have login accounts.

Examples:

Head Wrangler

✓ Login Account

Wrangler

Optional

Seasonal Wrangler

Usually no login

Office Staff

Optional

This allows Ranch Ledger to manage employees without requiring every employee to be a software user.

# Employee

## Description

An Employee is a ranch staff member.

Employees are operational records and do not automatically receive login access.

An Employee may optionally be linked to a User account if they require access to Ranch Ledger.

---

## Created By

Ranch Administrator

---

## Managed By

- Ranch Administrator
- Head Wrangler for limited operational fields

---

## Used By

- Ranch Administrator
- Head Wrangler
- Operations
- Reports

---

## Relationships

An Employee belongs to one Ranch.

An Employee may optionally have one User account.

An Employee may lead many Activities.

An Employee may have certifications.

An Employee may have a work schedule.

---

## Typical Information

- First Name
- Last Name
- Nickname
- Phone
- Email
- Position
- Employment Status
- Hire Date
- Notes

---

## Employee Positions

Examples:

- Head Wrangler
- Wrangler
- Assistant Wrangler
- Fishing Guide
- Hiking Guide
- Ranch Manager
- Office Staff
- Maintenance

---

## Operational Information

Employees may have:

- Certifications
- Trail Qualifications
- Activity Qualifications
- Availability
- Work Schedule

---

## Login Access

Employees are not required to have login accounts.

Examples:

- Head Wrangler usually has a login account.
- Wrangler may or may not have a login account.
- Seasonal Wrangler usually does not have a login account.
- Office Staff may or may not have a login account.

This allows Ranch Ledger to manage employees without requiring every employee to be a software user.

# User

## Description

A User is a person with login access to Ranch Ledger.

Users authenticate through Supabase Auth.

A User may optionally be linked to an Employee record.

---

## Created By

- Ranch Administrator
- Platform onboarding

---

## Managed By

- Ranch Administrator
- Platform Administrator for support/billing-level issues

---

## Used By

- Authentication
- Permissions
- Audit history
- Operations
- Administration

---

## Relationships

A User may belong to one or more Ranches through Ranch Memberships.

A User may optionally be linked to one Employee record per Ranch.

A User has one software role per Ranch.

---

## Typical Information

- Email
- First Name
- Last Name
- Phone
- Avatar
- Active Status

---

## Notes

Users are for system access.

Employees are for ranch operations.

A person can be both an Employee and a User, but they do not have to be.

# Ranch Membership

## Description

A Ranch Membership connects a User to a Ranch and defines that User's software permissions inside that Ranch.

---

## Created By

Ranch Administrator

---

## Managed By

Ranch Administrator

---

## Relationships

A Ranch Membership belongs to one Ranch.

A Ranch Membership belongs to one User.

A Ranch Membership may optionally link to one Employee record.

---

## Software Roles

- ranch_administrator
- head_wrangler
- wrangler
- viewer

---

## Notes

Software roles control access.

Employee positions describe real-world job titles.

These should remain independent.