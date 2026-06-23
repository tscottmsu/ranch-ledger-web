import "server-only";
import { requireRanchAdministrator } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { Trail } from "../types";
export type TrailInput = { name: string; difficulty: string | null; estimated_duration_minutes: number | null; description: string | null; notes: string | null; active: boolean };
export async function listTrails(): Promise<Trail[]> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("trails").select("*").eq("ranch_id", ranchId).order("active", { ascending: false }).order("name"); if (error) throw error; return data as Trail[]; }
export async function getTrail(id: string): Promise<Trail | null> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("trails").select("*").eq("ranch_id", ranchId).eq("id", id).maybeSingle(); if (error) throw error; return data as Trail | null; }
export async function createTrail(input: TrailInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("trails").insert({ ...input, ranch_id: ranchId }); }
export async function updateTrail(id: string, input: TrailInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("trails").update(input).eq("ranch_id", ranchId).eq("id", id); }
export async function archiveTrail(id: string) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("trails").update({ active: false }).eq("ranch_id", ranchId).eq("id", id); }
