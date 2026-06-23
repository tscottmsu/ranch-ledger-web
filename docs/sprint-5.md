# Sprint 5: Ride Assignment Engine and Operations Board

## 1. Sprint Goal

Sprint 5 turns Ranch Ledger from CRUD/setup software into the daily ride desk workflow. The goal is to make the Head Wrangler's morning and afternoon operations practical, guided, and centered on assigning real guests to real rides with horses, trails, wranglers, validation warnings, and a clear Ready state.

This sprint establishes Ride Assignment as Ranch Ledger's core value. Activities remain useful configuration and implementation details, but the product experience should lead with the operational question: "What rides are going out today, and are they ready?"

## 2. Product Principles

- Operations Board first.
- Horseback ride workflow is the flagship experience.
- Activities are configuration and an internal implementation detail, not the main product surface.
- Future activities like fishing, hikes, and wagon rides should reuse the same assignment engine.
- The Head Wrangler workflow should feel guided and practical, not generic.

## 3. Head Wrangler Workflow

- Review today's arriving and checked-in guests.
- Create or open today's ride, such as Morning Ride or Afternoon Ride.
- Add guests to the ride.
- Recommend or select a trail.
- Assign horses to guests.
- Assign a wrangler.
- Show validation warnings.
- Mark the ride Ready.

## 4. Sprint 5 Scope

- Ride operations board.
- Ride builder workspace.
- Ride assignment schema.
- Trail recommendation placeholder.
- Horse assignment workflow.
- Wrangler assignment workflow.
- Validation/warnings engine v1.
- Ready-state enforcement.

## 5. Data Model Plan

Planned tables:

- `rides`: one scheduled ride instance for a ranch, date, time window, trail, status, and source activity configuration.
- `ride_guests`: guests assigned to a ride.
- `ride_horse_assignments`: horse assignments for ride guests.
- `ride_wrangler_assignments`: employees assigned as wranglers for a ride.
- `ride_validation_warnings`: generated warnings and blocking issues for a ride.

## 6. Validation Rules v1

- Guest assigned to another ride today.
- Horse assigned to another active/ready ride.
- Missing horse assignment.
- Missing wrangler assignment.
- Missing trail.
- Trail difficulty warning.
- Duplicate trail recently used by same guest.
- Inactive/unavailable horse.

## 7. Routes

Planned routes:

- `/dashboard/operations`
- `/dashboard/rides/[rideId]`

## 8. Feature Folder Plan

Use:

```text
features/rides/
  components/
  data/
  types.ts
```

## 9. Out of Scope

- Live wrangler tracking.
- Emergency beacon.
- Advanced automated horse matching.
- Full trail scoring algorithm.
- Guest login.
- Mobile app implementation.

## 10. Acceptance Criteria

- Head Wrangler/Admin can create a ride for today.
- Guests can be added to a ride.
- Trail can be assigned.
- Horses can be assigned to guests.
- Wrangler can be assigned.
- Warnings display clearly.
- Ride cannot be marked Ready if blocking issues exist.
- Operations Board shows ride status clearly.
