import "server-only";

import { getCurrentUser } from "@/features/authentication/services/auth-service";
import { createClient } from "@/lib/supabase/server";

export type CurrentRanchContext = {
  ranchId: string;
  ranchName: string;
  timezone: string;
  role: "ranch_administrator" | "head_wrangler" | "wrangler" | "viewer";
};

export async function getCurrentRanchContext(): Promise<CurrentRanchContext | null> {
  const { user } = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data: membership, error } = await supabase.from("ranch_memberships").select("ranch_id,role").eq("user_id", user.id).eq("status", "active").limit(1).maybeSingle();
  if (error) throw error;
  if (!membership) return null;
  const { data: ranch, error: ranchError } = await supabase.from("ranches").select("name,timezone").eq("id", membership.ranch_id).single();
  if (ranchError) throw ranchError;
  return { ranchId: membership.ranch_id, ranchName: ranch.name, timezone: ranch.timezone, role: membership.role as CurrentRanchContext["role"] };
}

export async function requireOperationsManager(): Promise<CurrentRanchContext> {
  const context = await getCurrentRanchContext();
  if (!context || !["ranch_administrator", "head_wrangler"].includes(context.role)) throw new Error("Daily Operations access is required.");
  return context;
}

export async function requireRanchAdministrator(): Promise<CurrentRanchContext> {
  const context = await getCurrentRanchContext();
  if (!context || context.role !== "ranch_administrator") throw new Error("Ranch Administrator access is required.");
  return context;
}
