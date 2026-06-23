import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  AvailableHorse,
  AvailableWrangler,
  EligibleRideGuest,
  Ride,
  RideOption,
  RideStatus,
  RideTrailOption,
  RideValidationWarning,
  RideWithAssignments,
  RideWranglerRole,
  Saddle,
} from "../types";
import type { RideInput } from "./ride-service";

const rideSelect = "*,activity_type:activity_types(name),trail:trails(name,difficulty,estimated_duration_minutes)";

export async function findRidesForDate(ranchId: string, date: string): Promise<RideWithAssignments[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rides").select(rideSelect).eq("ranch_id", ranchId).eq("ride_date", date).order("start_time");
  if (error) throw error;
  return hydrateRideAssignments(ranchId, data as RideWithAssignments[]);
}

export async function findRideById(ranchId: string, rideId: string): Promise<RideWithAssignments | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rides").select(rideSelect).eq("ranch_id", ranchId).eq("id", rideId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [ride] = await hydrateRideAssignments(ranchId, [data as RideWithAssignments]);
  return ride ?? null;
}

export async function findRideRecord(ranchId: string, rideId: string): Promise<Ride | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rides").select("*").eq("ranch_id", ranchId).eq("id", rideId).maybeSingle();
  if (error) throw error;
  return data as Ride | null;
}

export async function insertRide(ranchId: string, input: RideInput) {
  const supabase = await createClient();
  return supabase.from("rides").insert({ ...input, ranch_id: ranchId }).select("id").single();
}

export async function updateRideRecord(ranchId: string, rideId: string, input: Partial<RideInput> | { status: RideStatus; trail_id?: string | null }) {
  const supabase = await createClient();
  return supabase.from("rides").update(input).eq("ranch_id", ranchId).eq("id", rideId);
}

export async function insertRideGuest(ranchId: string, rideId: string, guestId: string, reservationId: string | null) {
  const supabase = await createClient();
  return supabase.from("ride_guests").upsert({ ranch_id: ranchId, ride_id: rideId, guest_id: guestId, reservation_id: reservationId, status: "assigned" }, { onConflict: "ride_id,guest_id" }).select("id").single();
}

export async function updateRideGuestStatus(ranchId: string, rideGuestId: string, status: "assigned" | "checked_in" | "removed") {
  const supabase = await createClient();
  return supabase.from("ride_guests").update({ status }).eq("ranch_id", ranchId).eq("id", rideGuestId);
}

export async function upsertHorseAssignment(ranchId: string, rideId: string, rideGuestId: string, horseId: string, saddleId?: string | null) {
  const supabase = await createClient();
  return supabase.from("ride_horse_assignments").upsert({ ranch_id: ranchId, ride_id: rideId, ride_guest_id: rideGuestId, horse_id: horseId, saddle_id: saddleId ?? null }, { onConflict: "ride_guest_id" });
}

export async function removeHorseAssignmentRecord(ranchId: string, assignmentId: string) {
  const supabase = await createClient();
  return supabase.from("ride_horse_assignments").delete().eq("ranch_id", ranchId).eq("id", assignmentId);
}

export async function upsertWranglerAssignment(ranchId: string, rideId: string, employeeId: string, role: RideWranglerRole) {
  const supabase = await createClient();
  return supabase.from("ride_wrangler_assignments").upsert({ ranch_id: ranchId, ride_id: rideId, employee_id: employeeId, role }, { onConflict: "ride_id,employee_id" });
}

export async function removeWranglerAssignmentRecord(ranchId: string, assignmentId: string) {
  const supabase = await createClient();
  return supabase.from("ride_wrangler_assignments").delete().eq("ranch_id", ranchId).eq("id", assignmentId);
}

export async function findRideOptions(ranchId: string): Promise<{ activityTypes: RideOption[]; trails: RideTrailOption[] }> {
  const supabase = await createClient();
  const [activityTypes, trails] = await Promise.all([
    supabase.from("activity_types").select("id,name").eq("ranch_id", ranchId).eq("active", true).order("name"),
    supabase.from("trails").select("id,name,difficulty,estimated_duration_minutes").eq("ranch_id", ranchId).eq("active", true).order("name"),
  ]);
  if (activityTypes.error) throw activityTypes.error;
  if (trails.error) throw trails.error;
  return { activityTypes: activityTypes.data as RideOption[], trails: trails.data as RideTrailOption[] };
}

export async function findSaddles(ranchId: string): Promise<Saddle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("saddles").select("*").eq("ranch_id", ranchId).is("archived_at", null).order("status").order("name");
  if (error) throw error;
  return data as Saddle[];
}

export async function findReservationGuestAssignment(ranchId: string, reservationId: string, guestId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reservation_guest_assignments").select("*,horse:horses(name),saddle:saddles(name)").eq("ranch_id", ranchId).eq("reservation_id", reservationId).eq("guest_id", guestId).maybeSingle();
  if (error) throw error;
  return data as ({ horse_id: string | null; saddle_id: string | null; riding_ability: string | null; notes: string | null; horse: { name: string } | null; saddle: { name: string } | null } | null);
}

export async function findEligibleGuestsForDate(ranchId: string, date: string): Promise<EligibleRideGuest[]> {
  const supabase = await createClient();
  const [guests, rideGuests, prepAssignments] = await Promise.all([
    supabase.from("guests").select("id,first_name,last_name,reservation_id,riding_experience,weight_lbs,status,arrival_date,departure_date").eq("ranch_id", ranchId).in("status", ["reserved", "checked_in", "ready_for_assignment", "assigned"]).order("last_name"),
    supabase.from("ride_guests").select("guest_id,ride:rides(id,name,ride_date,status)").eq("ranch_id", ranchId).neq("status", "removed"),
    supabase.from("reservation_guest_assignments").select("guest_id,horse_id,saddle_id,riding_ability,horse:horses(name),saddle:saddles(name)").eq("ranch_id", ranchId),
  ]);
  if (guests.error) throw guests.error;
  if (rideGuests.error) throw rideGuests.error;
  if (prepAssignments.error) throw prepAssignments.error;
  const assignments = new Map<string, { id: string; name: string; ride_date: string; status: string }>();
  const prep = new Map<string, { horse_id: string | null; saddle_id: string | null; riding_ability: string | null; horse: { name: string } | null; saddle: { name: string } | null }>();
  (rideGuests.data as unknown as Array<{ guest_id: string; ride: { id: string; name: string; ride_date: string; status: string } | null }>).forEach((item) => {
    if (item.ride?.ride_date === date && !["completed", "cancelled"].includes(item.ride.status)) assignments.set(item.guest_id, item.ride);
  });
  (prepAssignments.data as unknown as Array<{ guest_id: string; horse_id: string | null; saddle_id: string | null; riding_ability: string | null; horse: { name: string } | null; saddle: { name: string } | null }>).forEach((item) => prep.set(item.guest_id, item));
  return (guests.data as Array<EligibleRideGuest & { arrival_date: string | null; departure_date: string | null }>).filter((guest) => {
    const inHouse = (!guest.arrival_date || guest.arrival_date <= date) && (!guest.departure_date || guest.departure_date >= date);
    return inHouse || ["checked_in", "ready_for_assignment", "assigned"].includes(guest.status);
  }).map((guest) => {
    const assignment = assignments.get(guest.id);
    const prepAssignment = prep.get(guest.id);
    return { id: guest.id, first_name: guest.first_name, last_name: guest.last_name, reservation_id: guest.reservation_id, riding_experience: guest.riding_experience, weight_lbs: guest.weight_lbs, status: guest.status, assigned_ride_id: assignment?.id ?? null, assigned_ride_name: assignment?.name ?? null, default_horse_id: prepAssignment?.horse_id ?? null, default_horse_name: prepAssignment?.horse?.name ?? null, default_saddle_id: prepAssignment?.saddle_id ?? null, default_saddle_name: prepAssignment?.saddle?.name ?? null, riding_ability: prepAssignment?.riding_ability ?? null };
  });
}

export async function findAvailableHorsesForDate(ranchId: string, date: string): Promise<AvailableHorse[]> {
  const supabase = await createClient();
  const [horses, assignments] = await Promise.all([
    supabase.from("horses").select("id,name,status,temperament,experience_level").eq("ranch_id", ranchId).order("name"),
    supabase.from("ride_horse_assignments").select("horse_id,ride:rides(id,name,ride_date,status)").eq("ranch_id", ranchId),
  ]);
  if (horses.error) throw horses.error;
  if (assignments.error) throw assignments.error;
  const activeAssignments = new Map<string, { id: string; name: string }>();
  (assignments.data as unknown as Array<{ horse_id: string; ride: { id: string; name: string; ride_date: string; status: string } | null }>).forEach((item) => {
    if (item.ride?.ride_date === date && ["ready", "active"].includes(item.ride.status)) activeAssignments.set(item.horse_id, item.ride);
  });
  return (horses.data as AvailableHorse[]).map((horse) => {
    const assignment = activeAssignments.get(horse.id);
    return { ...horse, assigned_ride_id: assignment?.id ?? null, assigned_ride_name: assignment?.name ?? null };
  });
}

export async function findAvailableWranglersForDate(ranchId: string, date: string): Promise<AvailableWrangler[]> {
  const supabase = await createClient();
  const [employees, assignments] = await Promise.all([
    supabase.from("employees").select("id,first_name,last_name,position").eq("ranch_id", ranchId).eq("employment_status", "active").order("last_name"),
    supabase.from("ride_wrangler_assignments").select("employee_id,ride:rides(id,name,ride_date,status)").eq("ranch_id", ranchId),
  ]);
  if (employees.error) throw employees.error;
  if (assignments.error) throw assignments.error;
  const activeAssignments = new Map<string, { id: string; name: string }>();
  (assignments.data as unknown as Array<{ employee_id: string; ride: { id: string; name: string; ride_date: string; status: string } | null }>).forEach((item) => {
    if (item.ride?.ride_date === date && ["ready", "active"].includes(item.ride.status)) activeAssignments.set(item.employee_id, item.ride);
  });
  return (employees.data as AvailableWrangler[]).map((employee) => {
    const assignment = activeAssignments.get(employee.id);
    return { ...employee, assigned_ride_id: assignment?.id ?? null, assigned_ride_name: assignment?.name ?? null };
  });
}

export async function resolveOpenWarnings(ranchId: string, rideId: string) {
  const supabase = await createClient();
  return supabase.from("ride_validation_warnings").update({ resolved_at: new Date().toISOString() }).eq("ranch_id", ranchId).eq("ride_id", rideId).is("resolved_at", null);
}

export async function insertValidationWarnings(warnings: Array<Omit<RideValidationWarning, "id" | "created_at" | "updated_at" | "resolved_at">>) {
  if (!warnings.length) return { error: null };
  const supabase = await createClient();
  return supabase.from("ride_validation_warnings").insert(warnings);
}

async function hydrateRideAssignments(ranchId: string, rides: RideWithAssignments[]): Promise<RideWithAssignments[]> {
  if (!rides.length) return [];
  const supabase = await createClient();
  const rideIds = rides.map((ride) => ride.id);
  const [guests, horses, wranglers, warnings] = await Promise.all([
    supabase.from("ride_guests").select("*,guest:guests(first_name,last_name,riding_experience,weight_lbs)").eq("ranch_id", ranchId).in("ride_id", rideIds).neq("status", "removed").order("created_at"),
    supabase.from("ride_horse_assignments").select("*,horse:horses(name,status,temperament),saddle:saddles(name,saddle_number,status)").eq("ranch_id", ranchId).in("ride_id", rideIds).order("created_at"),
    supabase.from("ride_wrangler_assignments").select("*,employee:employees(first_name,last_name,position)").eq("ranch_id", ranchId).in("ride_id", rideIds).order("role").order("created_at"),
    supabase.from("ride_validation_warnings").select("*").eq("ranch_id", ranchId).in("ride_id", rideIds).is("resolved_at", null).order("severity").order("created_at"),
  ]);
  if (guests.error) throw guests.error;
  if (horses.error) throw horses.error;
  if (wranglers.error) throw wranglers.error;
  if (warnings.error) throw warnings.error;
  return rides.map((ride) => ({
    ...ride,
    guests: (guests.data as RideWithAssignments["guests"]).filter((item) => item.ride_id === ride.id),
    horse_assignments: (horses.data as RideWithAssignments["horse_assignments"]).filter((item) => item.ride_id === ride.id),
    wrangler_assignments: (wranglers.data as RideWithAssignments["wrangler_assignments"]).filter((item) => item.ride_id === ride.id),
    validation_warnings: (warnings.data as RideValidationWarning[]).filter((item) => item.ride_id === ride.id),
  }));
}
