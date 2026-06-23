"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RideStatus, RideWranglerRole } from "../types";
import {
  addGuestToRide,
  assignHorseToGuest,
  assignTrail,
  assignWrangler,
  createRide,
  regenerateValidationWarnings,
  removeGuestFromRide,
  removeHorseAssignment,
  removeWranglerAssignment,
  updateRide,
  updateRideStatus,
  type RideInput,
} from "./ride-service";

const rideStatuses: RideStatus[] = ["draft", "assigning", "ready", "active", "completed", "cancelled"];
const wranglerRoles: RideWranglerRole[] = ["lead", "assistant"];

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseRide(formData: FormData): RideInput {
  const capacityValue = value(formData, "capacity");
  const capacity = capacityValue ? Number(capacityValue) : null;
  const status = value(formData, "status") as RideStatus;
  return {
    activity_type_id: value(formData, "activityType"),
    trail_id: value(formData, "trail") || null,
    name: value(formData, "name") || "Morning Ride",
    ride_date: value(formData, "date"),
    start_time: value(formData, "startTime") || null,
    end_time: value(formData, "endTime") || null,
    status: rideStatuses.includes(status) ? status : "draft",
    capacity: capacity && Number.isInteger(capacity) && capacity > 0 ? capacity : null,
    notes: value(formData, "notes") || null,
  };
}

function revalidateRides(rideId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/operations");
  if (rideId) revalidatePath(`/dashboard/rides/${rideId}`);
}

export async function createRideAction(formData: FormData) {
  const input = parseRide(formData);
  if (!input.ride_date) throw new Error("Ride date is required.");
  let result: Awaited<ReturnType<typeof createRide>>;
  try {
    result = await createRide(input);
  } catch {
    throw new Error("Ranch Ledger could not create this ride. Please try again.");
  }
  const { data, error } = result;
  if (error) throw new Error("Ranch Ledger could not create this ride. Please try again.");
  await regenerateValidationWarnings(data.id);
  revalidateRides(data.id);
  redirect(`/dashboard/rides/${data.id}`);
}

export async function updateRideAction(rideId: string, formData: FormData) {
  const input = parseRide(formData);
  const { error } = await updateRide(rideId, input);
  if (error) throw new Error(error.message);
  await regenerateValidationWarnings(rideId);
  revalidateRides(rideId);
}

export async function assignTrailAction(rideId: string, formData: FormData) {
  const { error } = await assignTrail(rideId, value(formData, "trail") || null);
  if (error) throw new Error(error.message);
  revalidateRides(rideId);
}

export async function addGuestToRideAction(rideId: string, formData: FormData) {
  const guestId = value(formData, "guest");
  if (!guestId) throw new Error("Choose a guest to add.");
  const { error } = await addGuestToRide(rideId, guestId);
  if (error) throw new Error(error.message);
  revalidateRides(rideId);
}

export async function removeGuestFromRideAction(rideId: string, rideGuestId: string) {
  const { error } = await removeGuestFromRide(rideGuestId);
  if (error) throw new Error(error.message);
  await regenerateValidationWarnings(rideId);
  revalidateRides(rideId);
}

export async function assignHorseAction(rideId: string, rideGuestId: string, formData: FormData) {
  const horseId = value(formData, "horse");
  if (!horseId) throw new Error("Choose a horse.");
  const { error } = await assignHorseToGuest(rideId, rideGuestId, horseId);
  if (error) throw new Error(error.message);
  revalidateRides(rideId);
}

export async function removeHorseAssignmentAction(rideId: string, assignmentId: string) {
  const { error } = await removeHorseAssignment(assignmentId);
  if (error) throw new Error(error.message);
  await regenerateValidationWarnings(rideId);
  revalidateRides(rideId);
}

export async function assignWranglerAction(rideId: string, formData: FormData) {
  const employeeId = value(formData, "wrangler");
  const role = value(formData, "role") as RideWranglerRole;
  if (!employeeId) throw new Error("Choose a wrangler.");
  const { error } = await assignWrangler(rideId, employeeId, wranglerRoles.includes(role) ? role : "assistant");
  if (error) throw new Error(error.message);
  revalidateRides(rideId);
}

export async function removeWranglerAssignmentAction(rideId: string, assignmentId: string) {
  const { error } = await removeWranglerAssignment(assignmentId);
  if (error) throw new Error(error.message);
  await regenerateValidationWarnings(rideId);
  revalidateRides(rideId);
}

export async function updateRideStatusAction(rideId: string, status: RideStatus) {
  if (!rideStatuses.includes(status)) throw new Error("Invalid ride status.");
  const { error } = await updateRideStatus(rideId, status);
  if (error) throw new Error(error.message);
  revalidateRides(rideId);
}

export async function regenerateRideWarningsAction(rideId: string) {
  const { error } = await regenerateValidationWarnings(rideId);
  if (error) throw new Error(error.message);
  revalidateRides(rideId);
}
