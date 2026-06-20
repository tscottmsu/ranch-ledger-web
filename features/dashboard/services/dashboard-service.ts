import "server-only";

import { getCurrentUser } from "@/features/authentication/services/auth-service";
import { getRanchForUser } from "@/features/ranch/services/ranch-service";
import type { DashboardContext } from "../types";

export async function getDashboardContext(): Promise<DashboardContext | null> {
  const { user } = await getCurrentUser();
  if (!user) return null;
  const ranch = await getRanchForUser(user.id);
  return { user, ranch };
}
