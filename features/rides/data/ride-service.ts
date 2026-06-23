import "server-only";

import { getCurrentRanchContext } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { RideStatus, RideWranglerRole } from "../types";
import {
  findAvailableHorsesForDate,
  findAvailableWranglersForDate,
  findEligibleGuestsForDate,
  findRideById,
  findRideOptions,
  findRideRecord,
  findRidesForDate,
  insertRide,
  insertRideGuest,
  removeHorseAssignmentRecord,
  removeWranglerAssignmentRecord,
  updateRideGuestStatus,
  updateRideRecord,
  upsertHorseAssignment,
  upsertWranglerAssignment,
} from "./ride-repository";
import { ensureHorsebackRideSetupForRanch } from "./ride-setup-service";
import { saveRideValidationWarnings } from "./ride-validation-service";

export type RideInput = {
  activity_type_id: string;
  trail_id: string | null;
  name: string;
  ride_date: string;
  start_time: string | null;
  end_time: string | null;
  status: RideStatus;
  capacity: number | null;
  notes: string | null;
};

async function requireRideOperationsManager() {
  const context = await getCurrentRanchContext();
  if (!context || !["ranch_administrator", "head_wrangler"].includes(context.role)) throw new Error("Ride Operations access is required.");
  const supabase = await createClient();
  const { data, error } = await supabase.from("ranches").select("timezone").eq("id", context.ranchId).single();
  if (error) throw error;
  return { ...context, timezone: data.timezone as string };
}

export function currentDateInTimezone(timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export async function listRidesForDate(date?: string) {
  const context = await requireRideOperationsManager();
  return findRidesForDate(context.ranchId, date ?? currentDateInTimezone(context.timezone));
}

export async function getRideById(rideId: string) {
  const { ranchId } = await requireRideOperationsManager();
  return findRideById(ranchId, rideId);
}

export async function getTodaysRideOperations() {
  const context = await requireRideOperationsManager();
  const date = currentDateInTimezone(context.timezone);
  await ensureHorsebackRideSetupForRanch(context.ranchId);
  const [rides, options, eligibleGuests, availableHorses, availableWranglers] = await Promise.all([
    findRidesForDate(context.ranchId, date),
    findRideOptions(context.ranchId),
    findEligibleGuestsForDate(context.ranchId, date),
    findAvailableHorsesForDate(context.ranchId, date),
    findAvailableWranglersForDate(context.ranchId, date),
  ]);
  return {
    date,
    timezone: context.timezone,
    rides,
    eligibleGuests,
    availableHorses,
    availableWranglers,
    activityTypes: options.activityTypes,
    trails: options.trails,
    counts: {
      total: rides.length,
      draft: rides.filter((ride) => ride.status === "draft").length,
      assigning: rides.filter((ride) => ride.status === "assigning").length,
      ready: rides.filter((ride) => ride.status === "ready").length,
      active: rides.filter((ride) => ride.status === "active").length,
      completed: rides.filter((ride) => ride.status === "completed").length,
      cancelled: rides.filter((ride) => ride.status === "cancelled").length,
    },
  };
}

export async function getRideBuilderData(rideId: string) {
  const context = await requireRideOperationsManager();
  const ride = await findRideById(context.ranchId, rideId);
  if (!ride) return null;
  const [options, eligibleGuests, availableHorses, availableWranglers] = await Promise.all([
    findRideOptions(context.ranchId),
    findEligibleGuestsForDate(context.ranchId, ride.ride_date),
    findAvailableHorsesForDate(context.ranchId, ride.ride_date),
    findAvailableWranglersForDate(context.ranchId, ride.ride_date),
  ]);
  return { ride, activityTypes: options.activityTypes, trails: options.trails, eligibleGuests, availableHorses, availableWranglers };
}

export async function createRide(input: RideInput) {
  const { ranchId } = await requireRideOperationsManager();
  const activityTypeId = input.activity_type_id || await ensureHorsebackRideSetupForRanch(ranchId);
  return insertRide(ranchId, { ...input, activity_type_id: activityTypeId });
}

export async function updateRide(rideId: string, input: Partial<RideInput>) {
  const { ranchId } = await requireRideOperationsManager();
  return updateRideRecord(ranchId, rideId, input);
}

export async function updateRideStatus(rideId: string, status: RideStatus) {
  const { ranchId } = await requireRideOperationsManager();
  if (status === "ready") {
    const ride = await findRideById(ranchId, rideId);
    if (!ride) return { error: new Error("Ride not found.") };
    const { warnings, error } = await saveRideValidationWarnings(ride);
    if (error) return { error };
    if (warnings.some((warning) => warning.severity === "blocking")) return { error: new Error("Resolve blocking warnings before marking this ride ready.") };
  }
  return updateRideRecord(ranchId, rideId, { status });
}

export async function assignTrail(rideId: string, trailId: string | null) {
  const { ranchId } = await requireRideOperationsManager();
  const result = await updateRideRecord(ranchId, rideId, { trail_id: trailId });
  await regenerateValidationWarnings(rideId);
  return result;
}

export async function addGuestToRide(rideId: string, guestId: string) {
  const { ranchId } = await requireRideOperationsManager();
  const ride = await findRideRecord(ranchId, rideId);
  if (!ride) return { error: new Error("Ride not found.") };
  const eligibleGuests = await findEligibleGuestsForDate(ranchId, ride.ride_date);
  const guest = eligibleGuests.find((item) => item.id === guestId);
  if (!guest) return { error: new Error("Guest is not eligible for this ride date.") };
  const result = await insertRideGuest(ranchId, rideId, guestId, guest.reservation_id);
  await regenerateValidationWarnings(rideId);
  return result;
}

export async function removeGuestFromRide(rideGuestId: string) {
  const { ranchId } = await requireRideOperationsManager();
  const result = await updateRideGuestStatus(ranchId, rideGuestId, "removed");
  return result;
}

export async function assignHorseToGuest(rideId: string, rideGuestId: string, horseId: string) {
  const { ranchId } = await requireRideOperationsManager();
  const result = await upsertHorseAssignment(ranchId, rideId, rideGuestId, horseId);
  await regenerateValidationWarnings(rideId);
  return result;
}

export async function removeHorseAssignment(assignmentId: string) {
  const { ranchId } = await requireRideOperationsManager();
  return removeHorseAssignmentRecord(ranchId, assignmentId);
}

export async function assignWrangler(rideId: string, employeeId: string, role: RideWranglerRole) {
  const { ranchId } = await requireRideOperationsManager();
  const result = await upsertWranglerAssignment(ranchId, rideId, employeeId, role);
  await regenerateValidationWarnings(rideId);
  return result;
}

export async function removeWranglerAssignment(assignmentId: string) {
  const { ranchId } = await requireRideOperationsManager();
  return removeWranglerAssignmentRecord(ranchId, assignmentId);
}

export async function listEligibleGuestsForToday() {
  const context = await requireRideOperationsManager();
  return findEligibleGuestsForDate(context.ranchId, currentDateInTimezone(context.timezone));
}

export async function listAvailableHorses(date?: string) {
  const context = await requireRideOperationsManager();
  return findAvailableHorsesForDate(context.ranchId, date ?? currentDateInTimezone(context.timezone));
}

export async function listAvailableWranglers(date?: string) {
  const context = await requireRideOperationsManager();
  return findAvailableWranglersForDate(context.ranchId, date ?? currentDateInTimezone(context.timezone));
}

export async function regenerateValidationWarnings(rideId: string) {
  const { ranchId } = await requireRideOperationsManager();
  const ride = await findRideById(ranchId, rideId);
  if (!ride) return { warnings: [], error: new Error("Ride not found.") };
  return saveRideValidationWarnings(ride);
}
