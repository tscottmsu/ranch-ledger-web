import type { User } from "@supabase/supabase-js";

import type { Ranch } from "@/features/ranch/types";

export type DashboardContext = {
  user: User;
  ranch: Ranch | null;
  setupProgress: SetupProgress | null;
  guestSummary: GuestSummary | null;
};

export type GuestSummary = {
  guests: number;
  reservations: number;
  checkedIn: number;
};

export type SetupProgress = {
  employees: number;
  horses: number;
  trails: number;
  activityTypes: number;
  completed: number;
  total: 4;
};
