import type { User } from "@supabase/supabase-js";

import type { Ranch } from "@/features/ranch/types";

export type DashboardContext = {
  user: User;
  ranch: Ranch | null;
};
