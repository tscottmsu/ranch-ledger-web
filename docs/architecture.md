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