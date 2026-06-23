import "server-only";
import { requireRanchAdministrator } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { ActivityType } from "../types";
export type ActivityTypeInput = { name: string; description: string | null; active: boolean };
export async function listActivityTypes(): Promise<ActivityType[]> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("activity_types").select("*").eq("ranch_id", ranchId).order("active", { ascending: false }).order("name"); if (error) throw error; return data as ActivityType[]; }
export async function getActivityType(id: string): Promise<ActivityType | null> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("activity_types").select("*").eq("ranch_id", ranchId).eq("id", id).maybeSingle(); if (error) throw error; return data as ActivityType | null; }
export async function createActivityType(input: ActivityTypeInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("activity_types").insert({ ...input, ranch_id: ranchId }); }
export async function updateActivityType(id: string, input: ActivityTypeInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("activity_types").update(input).eq("ranch_id", ranchId).eq("id", id); }
export async function archiveActivityType(id: string) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("activity_types").update({ active: false }).eq("ranch_id", ranchId).eq("id", id); }
