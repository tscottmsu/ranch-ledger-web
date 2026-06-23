import "server-only";

import { getCurrentRanchContext } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { Saddle, SaddleStatus } from "../types";

export type SaddleInput = { name: string; saddle_number: string | null; type: string | null; seat_size: string | null; rider_height_min: number | null; rider_height_max: number | null; rider_weight_min: number | null; rider_weight_max: number | null; status: SaddleStatus; notes: string | null };

async function requireSaddleManager() {
  const context = await getCurrentRanchContext();
  if (!context || !["ranch_administrator", "head_wrangler"].includes(context.role)) throw new Error("Saddle setup access is required.");
  return context;
}

export async function listSaddles(): Promise<Saddle[]> {
  const { ranchId } = await requireSaddleManager();
  const supabase = await createClient();
  const { data, error } = await supabase.from("saddles").select("*").eq("ranch_id", ranchId).is("archived_at", null).order("status").order("name");
  if (error) throw error;
  return data as Saddle[];
}

export async function getSaddle(id: string): Promise<Saddle | null> {
  const { ranchId } = await requireSaddleManager();
  const supabase = await createClient();
  const { data, error } = await supabase.from("saddles").select("*").eq("ranch_id", ranchId).eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Saddle | null;
}

export async function createSaddle(input: SaddleInput) {
  const { ranchId } = await requireSaddleManager();
  const supabase = await createClient();
  return supabase.from("saddles").insert({ ...input, ranch_id: ranchId });
}

export async function updateSaddle(id: string, input: SaddleInput) {
  const { ranchId } = await requireSaddleManager();
  const supabase = await createClient();
  return supabase.from("saddles").update(input).eq("ranch_id", ranchId).eq("id", id);
}

export async function archiveSaddle(id: string) {
  const { ranchId } = await requireSaddleManager();
  const supabase = await createClient();
  return supabase.from("saddles").update({ archived_at: new Date().toISOString(), status: "inactive" }).eq("ranch_id", ranchId).eq("id", id);
}
