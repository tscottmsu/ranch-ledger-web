import "server-only";

import { getCurrentUser } from "@/features/authentication/services/auth-service";
import { getRanchForUser } from "@/features/ranch/services/ranch-service";
import { createClient } from "@/lib/supabase/server";
import type { DashboardContext } from "../types";

export async function getDashboardContext(): Promise<DashboardContext | null> {
  const { user } = await getCurrentUser();
  if (!user) return null;
  const ranch = await getRanchForUser(user.id);
  const [setupProgress, guestSummary] = ranch
    ? await Promise.all([getSetupProgress(ranch.id), getGuestSummary(ranch.id)])
    : [null, null];
  return { user, ranch, setupProgress, guestSummary };
}

async function getGuestSummary(ranchId: string) {
  const supabase = await createClient();
  const [guests, reservations, checkedIn] = await Promise.all([
    supabase.from("guests").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).neq("status", "archived"),
    supabase.from("reservations").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).neq("status", "archived"),
    supabase.from("guests").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).eq("status", "checked_in"),
  ]);
  return { guests: guests.count ?? 0, reservations: reservations.count ?? 0, checkedIn: checkedIn.count ?? 0 };
}

async function getSetupProgress(ranchId: string) {
  const supabase = await createClient();
  const [employees, horses, trails, activityTypes] = await Promise.all([
    supabase.from("employees").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).eq("employment_status", "active"),
    supabase.from("horses").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).eq("status", "active"),
    supabase.from("trails").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).eq("active", true),
    supabase.from("activity_types").select("id", { count: "exact", head: true }).eq("ranch_id", ranchId).eq("active", true),
  ]);
  const counts = { employees: employees.count ?? 0, horses: horses.count ?? 0, trails: trails.count ?? 0, activityTypes: activityTypes.count ?? 0 };
  return { ...counts, completed: Object.values(counts).filter((count) => count > 0).length, total: 4 as const };
}
