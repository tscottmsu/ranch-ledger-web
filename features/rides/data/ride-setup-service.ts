import "server-only";

import { createClient } from "@/lib/supabase/server";

export const DEFAULT_HORSEBACK_RIDE_NAME = "Horseback Ride";

export async function ensureHorsebackRideSetupForRanch(ranchId: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("ensure_default_horseback_ride_setup", { target_ranch_id: ranchId });
  if (error) throw error;
  return data as string;
}
