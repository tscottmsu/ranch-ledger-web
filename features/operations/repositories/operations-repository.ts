import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ActivityWithRelations } from "@/features/activities/types";
import type { ArrivalReservation } from "../types";

export async function findOperationsForDate(ranchId: string, date: string) {
  const supabase = await createClient();
  const [activities, checkedIn, readyGuests, arrivals] = await Promise.all([
    supabase.from("activities").select("*,activity_type:activity_types(name),trail:trails(name)").eq("ranch_id", ranchId).eq("activity_date", date).is("archived_at", null).order("start_time"),
    supabase.from("guests").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).eq("status", "checked_in"),
    supabase.from("guests").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).eq("status", "ready_for_assignment"),
    supabase.from("reservations").select("id,reservation_name,primary_contact_name,status").eq("ranch_id", ranchId).eq("arrival_date", date).not("status", "in", "(cancelled,archived)"),
  ]);
  if (activities.error) throw activities.error;
  if (checkedIn.error) throw checkedIn.error;
  if (readyGuests.error) throw readyGuests.error;
  if (arrivals.error) throw arrivals.error;
  return { activities: activities.data as ActivityWithRelations[], checkedInGuests: checkedIn.count ?? 0, readyGuests: readyGuests.count ?? 0, arrivals: arrivals.data as ArrivalReservation[] };
}
