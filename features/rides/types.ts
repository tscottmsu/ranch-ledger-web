export type RideStatus = "draft" | "assigning" | "ready" | "active" | "completed" | "cancelled";
export type RideGuestStatus = "assigned" | "checked_in" | "removed";
export type RideWranglerRole = "lead" | "assistant";
export type RideWarningSeverity = "info" | "warning" | "blocking";

export type Ride = {
  id: string;
  ranch_id: string;
  activity_type_id: string;
  trail_id: string | null;
  name: string;
  ride_date: string;
  start_time: string | null;
  end_time: string | null;
  status: RideStatus;
  capacity: number | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type RideGuest = {
  id: string;
  ranch_id: string;
  ride_id: string;
  guest_id: string;
  reservation_id: string | null;
  status: RideGuestStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RideHorseAssignment = {
  id: string;
  ranch_id: string;
  ride_id: string;
  ride_guest_id: string;
  horse_id: string;
  assigned_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RideWranglerAssignment = {
  id: string;
  ranch_id: string;
  ride_id: string;
  employee_id: string;
  role: RideWranglerRole;
  assigned_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RideValidationWarning = {
  id: string;
  ranch_id: string;
  ride_id: string;
  severity: RideWarningSeverity;
  code: string;
  title: string;
  message: string | null;
  subject_type: string | null;
  subject_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RideWithAssignments = Ride & {
  activity_type: { name: string } | null;
  trail: { name: string; difficulty: string | null } | null;
  guests: Array<RideGuest & { guest: { first_name: string; last_name: string; riding_experience: string | null } | null }>;
  horse_assignments: Array<RideHorseAssignment & { horse: { name: string; status: string } | null }>;
  wrangler_assignments: Array<RideWranglerAssignment & { employee: { first_name: string; last_name: string } | null }>;
  validation_warnings: RideValidationWarning[];
};
