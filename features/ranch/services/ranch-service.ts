import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Ranch } from "../types";

export type CreateRanchInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  timezone: string;
};

export async function getRanchForUser(userId: string): Promise<Ranch | null> {
  const supabase = await createClient();
  const { data: membership, error: membershipError } = await supabase
    .from("ranch_memberships")
    .select("ranch_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (membershipError) throw membershipError;
  if (!membership) return null;

  const { data, error } = await supabase
    .from("ranches")
    .select("id,name,slug,phone,email,address_line_1,timezone")
    .eq("id", membership.ranch_id)
    .single();
  if (error) throw error;
  return data as Ranch;
}

export async function createRanchWithAdministrator(input: CreateRanchInput) {
  const supabase = await createClient();
  return supabase.rpc("create_ranch_with_administrator", {
    ranch_name: input.name,
    ranch_phone: input.phone || null,
    ranch_email: input.email || null,
    ranch_address: input.address || null,
    ranch_timezone: input.timezone,
  });
}
