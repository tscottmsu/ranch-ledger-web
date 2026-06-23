import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Activity, ActivityOption, ActivityWithRelations } from "../types";
import type { ActivityInput } from "../services/activity-service";

const activitySelect = "*,activity_type:activity_types(name),trail:trails(name)";

export async function findActivities(ranchId: string): Promise<ActivityWithRelations[]> { const supabase = await createClient(); const { data, error } = await supabase.from("activities").select(activitySelect).eq("ranch_id", ranchId).order("activity_date", { ascending: false }).order("start_time"); if (error) throw error; return data as ActivityWithRelations[]; }
export async function findActivity(ranchId: string, id: string): Promise<Activity | null> { const supabase = await createClient(); const { data, error } = await supabase.from("activities").select("*").eq("ranch_id", ranchId).eq("id", id).maybeSingle(); if (error) throw error; return data as Activity | null; }
export async function findActivityOptions(ranchId: string): Promise<{ activityTypes: ActivityOption[]; trails: ActivityOption[] }> { const supabase = await createClient(); const [types, trails] = await Promise.all([supabase.from("activity_types").select("id,name").eq("ranch_id", ranchId).eq("active", true).order("name"), supabase.from("trails").select("id,name").eq("ranch_id", ranchId).eq("active", true).order("name")]); if (types.error) throw types.error; if (trails.error) throw trails.error; return { activityTypes: types.data as ActivityOption[], trails: trails.data as ActivityOption[] }; }
export async function insertActivity(ranchId: string, input: ActivityInput) { const supabase = await createClient(); return supabase.from("activities").insert({ ...input, ranch_id: ranchId }); }
export async function updateActivityRecord(ranchId: string, id: string, input: Partial<ActivityInput>) { const supabase = await createClient(); return supabase.from("activities").update(input).eq("ranch_id", ranchId).eq("id", id).is("archived_at", null); }
export async function archiveActivityRecord(ranchId: string, id: string) { const supabase = await createClient(); return supabase.from("activities").update({ archived_at: new Date().toISOString() }).eq("ranch_id", ranchId).eq("id", id).is("archived_at", null); }
