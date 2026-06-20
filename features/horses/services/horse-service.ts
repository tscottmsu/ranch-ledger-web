import "server-only";
import { requireRanchAdministrator } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { Horse, HorseStatus } from "../types";
export type HorseInput = { name: string; barn_name: string | null; status: HorseStatus; max_rider_weight_lbs: number | null; temperament: string | null; experience_level: string | null; notes: string | null };
export async function listHorses(): Promise<Horse[]> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("horses").select("*").eq("ranch_id", ranchId).order("status").order("name"); if (error) throw error; return data as Horse[]; }
export async function getHorse(id: string): Promise<Horse | null> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("horses").select("*").eq("ranch_id", ranchId).eq("id", id).maybeSingle(); if (error) throw error; return data as Horse | null; }
export async function createHorse(input: HorseInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("horses").insert({ ...input, ranch_id: ranchId }); }
export async function updateHorse(id: string, input: HorseInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("horses").update(input).eq("ranch_id", ranchId).eq("id", id); }
export async function archiveHorse(id: string) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("horses").update({ status: "inactive" }).eq("ranch_id", ranchId).eq("id", id); }
