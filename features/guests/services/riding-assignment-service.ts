import "server-only";

import { getCurrentRanchContext } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { Horse } from "@/features/horses/types";
import type { ReservationGuestAssignment, Saddle } from "@/features/rides/types";

async function requireRidingAssignmentManager() {
  const context = await getCurrentRanchContext();
  if (!context || !["ranch_administrator", "head_wrangler"].includes(context.role)) throw new Error("Ride prep access is required.");
  return context;
}

export type RidingAssignmentInput = { reservation_id: string; guest_id: string; horse_id: string | null; saddle_id: string | null; riding_ability: string | null; notes: string | null };

export async function getGuestRidingAssignmentOptions() {
  const { ranchId } = await requireRidingAssignmentManager();
  const supabase = await createClient();
  const [horses, saddles] = await Promise.all([
    supabase.from("horses").select("*").eq("ranch_id", ranchId).order("status").order("name"),
    supabase.from("saddles").select("*").eq("ranch_id", ranchId).is("archived_at", null).order("status").order("name"),
  ]);
  if (horses.error) throw horses.error;
  if (saddles.error) throw saddles.error;
  return { horses: horses.data as Horse[], saddles: saddles.data as Saddle[] };
}

export async function getGuestRidingAssignment(guestId: string) {
  const { ranchId } = await requireRidingAssignmentManager();
  const supabase = await createClient();
  const { data, error } = await supabase.from("reservation_guest_assignments").select("*").eq("ranch_id", ranchId).eq("guest_id", guestId).maybeSingle();
  if (error) throw error;
  return data as ReservationGuestAssignment | null;
}

export async function saveGuestRidingAssignment(input: RidingAssignmentInput) {
  const { ranchId } = await requireRidingAssignmentManager();
  const supabase = await createClient();
  return supabase.from("reservation_guest_assignments").upsert({ ...input, ranch_id: ranchId }, { onConflict: "reservation_id,guest_id" });
}
