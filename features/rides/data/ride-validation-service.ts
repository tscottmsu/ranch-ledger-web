import "server-only";

import type { RideValidationWarning, RideWithAssignments } from "../types";
import { findEligibleGuestsForDate, findRidesForDate, insertValidationWarnings, resolveOpenWarnings } from "./ride-repository";

type NewWarning = Omit<RideValidationWarning, "id" | "created_at" | "updated_at" | "resolved_at">;

function warning(ride: RideWithAssignments, severity: NewWarning["severity"], code: string, title: string, message: string, subjectType?: string, subjectId?: string): NewWarning {
  return { ranch_id: ride.ranch_id, ride_id: ride.id, severity, code, title, message, subject_type: subjectType ?? null, subject_id: subjectId ?? null };
}

export async function buildRideValidationWarnings(ride: RideWithAssignments): Promise<NewWarning[]> {
  const warnings: NewWarning[] = [];
  if (!ride.trail_id) warnings.push(warning(ride, "blocking", "missing_trail", "Choose a trail", "Pick a trail before the crew starts saddling."));
  if (!ride.guests.length) warnings.push(warning(ride, "blocking", "no_guests", "Add guests", "Assign guests before the horses are saddled."));
  if (!ride.wrangler_assignments.length) warnings.push(warning(ride, "blocking", "missing_wrangler", "Assign a wrangler", "Every ride needs at least one wrangler before it can leave the yard."));

  ride.guests.forEach((rideGuest) => {
    const hasHorse = ride.horse_assignments.some((assignment) => assignment.ride_guest_id === rideGuest.id);
    if (!hasHorse) {
      const guestName = rideGuest.guest ? `${rideGuest.guest.first_name} ${rideGuest.guest.last_name}` : "Guest";
      warnings.push(warning(ride, "blocking", "guest_missing_horse", `${guestName} needs a horse`, "Assign a horse to every guest on this ride.", "ride_guest", rideGuest.id));
    }
  });

  ride.horse_assignments.forEach((assignment) => {
    if (assignment.horse && assignment.horse.status !== "active") {
      warnings.push(warning(ride, "blocking", "horse_unavailable", `${assignment.horse.name} is not active`, "Choose an active, available horse for this guest.", "horse", assignment.horse_id));
    }
  });

  const todaysRides = await findRidesForDate(ride.ranch_id, ride.ride_date);
  const otherActiveRides = todaysRides.filter((item) => item.id !== ride.id && ["ready", "active"].includes(item.status));
  ride.horse_assignments.forEach((assignment) => {
    const conflict = otherActiveRides.find((item) => item.horse_assignments.some((other) => other.horse_id === assignment.horse_id));
    if (conflict) warnings.push(warning(ride, "blocking", "horse_double_booked", `${assignment.horse?.name ?? "Horse"} is already assigned`, `This horse is already on ${conflict.name}.`, "horse", assignment.horse_id));
  });

  const eligibleGuests = await findEligibleGuestsForDate(ride.ranch_id, ride.ride_date);
  ride.guests.forEach((rideGuest) => {
    const guest = eligibleGuests.find((item) => item.id === rideGuest.guest_id);
    if (guest?.assigned_ride_id && guest.assigned_ride_id !== ride.id) {
      warnings.push(warning(ride, "blocking", "guest_double_booked", `${guest.first_name} ${guest.last_name} is already assigned`, `This guest is already on ${guest.assigned_ride_name}.`, "guest", rideGuest.guest_id));
    }
  });

  if (ride.trail?.difficulty) {
    warnings.push(warning(ride, "info", "trail_difficulty_placeholder", "Review trail difficulty", `${ride.trail.name} is marked ${ride.trail.difficulty}. Confirm the group is comfortable before marking ready.`, "trail", ride.trail_id ?? undefined));
  }
  if (ride.trail_id && ride.guests.length) {
    warnings.push(warning(ride, "info", "duplicate_trail_placeholder", "Recent trail check", "Duplicate trail history will be scored in a later sprint. Ask guests if they rode this trail recently.", "trail", ride.trail_id));
  }

  return warnings;
}

export async function saveRideValidationWarnings(ride: RideWithAssignments) {
  const warnings = await buildRideValidationWarnings(ride);
  const resolved = await resolveOpenWarnings(ride.ranch_id, ride.id);
  if (resolved.error) return { warnings, error: resolved.error };
  const inserted = await insertValidationWarnings(warnings);
  return { warnings, error: inserted.error };
}
