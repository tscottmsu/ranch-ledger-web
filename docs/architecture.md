# Ranch Ledger Architecture

Ranch Ledger is a modular ranch operations platform that helps dude ranches manage guests, staff, activities, safety, and daily field operations.

## Core Product Concept

Everything belongs to a ranch.

The first working module is Operations.

The first Operations activity is Guided Rides, but the system should later support:

- fishing trips
- guided hikes
- wagon rides
- other guest activities

## Initial Modules

- Dashboard
- Operations
- Guests
- Trails
- Horses
- Maps
- Administration

## MVP Rule

Guests are records first, not login users.

Guest login can be added later.

## Core Roles

- administrator
- head_wrangler
- wrangler

## Future Roles

- guest
- maintenance
- lodging_manager
- kitchen_staff

## Assignment Engine

The core question:

Can this person or resource be assigned to this activity at this time?

For guided rides, the assignment pieces are:

- activity: guided ride
- time
- trail
- wrangler(s)
- guest(s)
- horse(s)

## Assignment Rule Results

Every assignment rule returns one of:

- PASS
- WARNING
- BLOCK

A BLOCK prevents confirmation.

A WARNING allows confirmation but should be clearly shown to the user.

## Hard Block Examples

- Guest is already assigned to another activity at the same time
- Wrangler is already assigned to another activity at the same time
- Horse is already assigned to another activity at the same time
- Guest is not checked in yet
- Guest has already checked out
- Ride exceeds maximum guest count
- Not enough horses are available
- Horse is inactive
- Guest weight exceeds horse maximum weight

## Warning Examples

- Guest has medical notes
- Guest has already ridden this trail during the current stay
- Guest experience may be too low for the trail
- Guest is close to horse maximum weight
- Horse has already worked multiple rides today
- Wrangler workload is high
- Wrangler may not be familiar with the trail

## Guided Ride Assignment Flow

1. Create activity
2. Choose activity type: Guided Ride
3. Choose trail
4. Choose date and time
5. Assign wrangler(s)
6. Add guests
7. Assign horses
8. Run assignment check
9. Show blocks and warnings
10. Allow confirmation only if there are no blocks

## Data Model Foundation

Core tables:

- ranches
- profiles
- ranch_memberships

Operations tables:

- activities
- activity_types
- activity_guests
- activity_staff
- activity_resources
- assignment_checks

Guided ride tables:

- trails
- horses
- ride_details

Safety tables:

- incidents
- trail_files
- live_locations
- emergency_events

## Employees vs Users

Employees are ranch staff records.

Not every employee needs to log in.

Users are people with Supabase authentication accounts.

Some employees may be linked to users, but this is optional.

Examples:

- A wrangler may be listed as an employee and assigned to rides without having login access.
- A head wrangler should usually be both an employee and a user.
- An administrator should be a user and may or may not also be an employee.

This keeps scheduling separate from system access.

## Head Wrangler Daily Guided Ride Workflow

The Head Wrangler begins the day by reviewing the guests currently on property.

For each guided ride, the Head Wrangler is expected to:

1. Review guests available for the day
2. Review each guest's ride history for the current stay
3. Review each guest's riding experience level
4. Assign guests to an appropriate route
5. Avoid assigning a guest to a route they have already completed during the current stay
6. Assign a horse to each guest for that ride
7. Assign a wrangler to lead the ride
8. Review warnings and blocking issues
9. Confirm the ride
10. Track the ride as preparing, active, completed, or cancelled

Horse assignments are ride-specific.

A horse may stay with a guest for the entire stay, but the system should not require this. The system should track horse history by guest so the Head Wrangler can see previous successful pairings.

The main goal of the guided ride workflow is to help the Head Wrangler safely and efficiently answer:

- Who is riding today?
- Which route should they ride?
- Have they already ridden this route?
- Is this route appropriate for their experience?
- Which horse should they ride?
- Who is leading the ride?

## Guest Intake vs Ride Assignment

Guest creation is an administrative workflow.

Administrators are responsible for creating and managing guest records, including stay dates, contact information, notes, and any relevant rider information.

Head Wranglers do not primarily create guests. They see the guests who are currently checked in or scheduled for the day and use that list to build ride groups.

The workflow is:

1. Administrator creates guest records
2. Administrator enters stay dates and guest details
3. Head Wrangler views today's available guests
4. Head Wrangler creates ride groups
5. Head Wrangler assigns route, horse, and wrangler
6. Head Wrangler confirms the ride group

This separates guest intake from field operations.

# Operations Board

## Purpose

The Operations Board is the primary workspace for the Head Wrangler.

It is the first screen displayed after login for users with the Head Wrangler role.

The purpose of the Operations Board is to answer one question:

> **Have all guests been safely and appropriately assigned to today's activities?**

The Operations Board is designed to support operational decision making rather than data entry.

---

## Primary User

Head Wrangler

Secondary users:

* Administrator
* Assistant Head Wrangler (future)

---

## Daily Workflow

The Head Wrangler begins the day by opening the Operations Board.

The workflow is:

1. Review all guests currently checked in and available for activities.
2. Identify guests who have not yet been assigned.
3. Determine how many ride groups are needed based on guest count, available wranglers, available horses, and operational constraints.
4. Build one or more ride groups.
5. Assign a trail to each ride group.
6. Assign a wrangler to each ride group.
7. Assign horses to each guest.
8. Review assignment warnings and blocking issues.
9. Confirm ride groups.
10. Monitor rides as they progress through the day.

---

## Operations Board Layout

### Summary

Display high-level operational information:

* Guests currently checked in
* Guests assigned
* Guests waiting for assignment
* Active ride groups
* Completed ride groups
* Conflicts requiring attention

---

### Guests Awaiting Assignment

Display only guests who are:

* Currently checked in
* Eligible for activities
* Not yet assigned to an activity for the selected time period

Each guest card should display:

* Name
* Riding experience
* Current stay dates
* Trails completed during current stay
* Assigned horse history
* Medical alerts (if applicable)

---

### Ride Groups

Each Ride Group should display:

* Group name
* Activity type
* Assigned trail
* Assigned wrangler
* Assigned guests
* Assigned horses
* Ride status
* Warning count
* Block count

Statuses:

* Draft
* Preparing
* Ready
* Active
* Completed
* Cancelled

---

### Warnings and Conflicts

The Operations Board should continuously surface operational issues.

Examples:

Warnings:

* Guest has already ridden this trail during current stay.
* Guest experience may not match trail difficulty.
* Horse has already completed multiple rides today.
* Wrangler workload is unusually high.

Blocking Issues:

* Horse already assigned.
* Wrangler already assigned.
* Guest already assigned.
* Guest not currently checked in.
* Horse exceeds rider weight limit.
* Ride exceeds maximum capacity.

Blocking issues must be resolved before a Ride Group can be confirmed.

---

## Design Philosophy

The Operations Board should function as a real-time operational dashboard.

Its purpose is not to help users create data.

Its purpose is to help the Head Wrangler make informed operational decisions quickly and safely.

The software should provide recommendations, warnings, and visibility while allowing the Head Wrangler to make the final decisions.

The Head Wrangler should be able to understand the operational state of the ranch within a few seconds of opening the screen.


# Ranch Setup Workflow

## Purpose

Before a ranch can begin daily operations, it must be configured by an Administrator.

The Administrator is responsible for creating the operational environment that the Head Wrangler and other staff will use.

The setup process is expected to happen once during initial deployment, with updates made over time as ranch operations change.

---

## Initial Ranch Setup

Administrator creates:

### Ranch Profile

* Ranch Name
* Address
* City
* State
* Country
* Phone Number
* Email Address
* Website
* Time Zone
* Logo
* Emergency Contact Information

---

### Employees

Administrator creates employee records.

Examples:

* Head Wrangler
* Wrangler
* Assistant Wrangler
* Guide
* Ranch Manager

Employee records exist independently of user accounts.

---

### User Accounts

Only employees who require access to Ranch Ledger receive login accounts.

Examples:

* Administrator
* Head Wrangler

Some employees, such as seasonal wranglers, may not require login access.

User accounts are linked to employee records when applicable.

---

### Horses

Administrator creates horse records.

Example information:

* Name
* Barn Name
* Status
* Maximum Rider Weight
* Temperament
* Experience Level
* Notes

---

### Trails

Administrator creates trail records.

Example information:

* Trail Name
* Difficulty
* Estimated Duration
* Description
* Active Status
* GPS Route (future)

---

## Transition to Operations

Once setup is complete, responsibility shifts to the Head Wrangler.

The Head Wrangler uses the configured ranch data to manage daily operations but generally does not create foundational records such as ranch information, employee records, horses, or trails.

This separation ensures operational staff focus on running the ranch rather than configuring it.

## Product Principles

Ranch Ledger should follow these principles as the platform grows:

1. The software recommends; people decide.

2. Warnings inform; blocks protect.

3. Every screen should answer a specific operational question.

4. Configuration is separate from operations.

5. Field users should accomplish common tasks in three taps or fewer.

6. Guests are records first, login users later only if needed.

7. Ranch data belongs to the ranch and should always be scoped by ranch.

8. The platform should be modular so new activity types can be added without redesigning the system.

9. The Head Wrangler should be able to understand the day’s operational state within a few seconds.

10. The Field App should prioritize safety, speed, and simplicity over feature depth.

11. Employee positions represent real-world responsibilities. Software roles represent permissions. The two should remain independent.