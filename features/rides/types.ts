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
  saddle_id: string | null;
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

export type RideOption = { id: string; name: string };
export type Saddle = { id: string; ranch_id: string; name: string; saddle_number: string | null; type: string | null; seat_size: string | null; status: string; notes: string | null; archived_at: string | null; created_at: string; updated_at: string };
export type ReservationGuestAssignment = { id: string; ranch_id: string; reservation_id: string; guest_id: string; horse_id: string | null; saddle_id: string | null; riding_ability: string | null; notes: string | null; assigned_by: string | null; created_at: string; updated_at: string };
export type RideTrailOption = RideOption & { difficulty: string | null; estimated_duration_minutes: number | null };
export type EligibleRideGuest = {
  id: string;
  first_name: string;
  last_name: string;
  reservation_id: string | null;
  riding_experience: string | null;
  weight_lbs: number | null;
  status: string;
  assigned_ride_id: string | null;
  assigned_ride_name: string | null;
  default_horse_id: string | null;
  default_horse_name: string | null;
  default_saddle_id: string | null;
  default_saddle_name: string | null;
  riding_ability: string | null;
};
export type AvailableHorse = { id: string; name: string; status: string; temperament: string | null; experience_level: string | null; assigned_ride_id: string | null; assigned_ride_name: string | null };
export type AvailableWrangler = { id: string; first_name: string; last_name: string; position: string | null; assigned_ride_id: string | null; assigned_ride_name: string | null };

export type RideWithAssignments = Ride & {
  activity_type: { name: string } | null;
  trail: { name: string; difficulty: string | null; estimated_duration_minutes?: number | null } | null;
  guests: Array<RideGuest & { guest: { first_name: string; last_name: string; riding_experience: string | null; weight_lbs: number | null } | null }>;
  horse_assignments: Array<RideHorseAssignment & { horse: { name: string; status: string; temperament: string | null } | null; saddle: { name: string; saddle_number: string | null; status: string } | null }>;
  wrangler_assignments: Array<RideWranglerAssignment & { employee: { first_name: string; last_name: string; position: string | null } | null }>;
  validation_warnings: RideValidationWarning[];
};

export type RideOperationsSnapshot = {
  date: string;
  timezone: string;
  rides: RideWithAssignments[];
  eligibleGuests: EligibleRideGuest[];
  activityTypes: RideOption[];
  trails: RideTrailOption[];
  availableHorses: AvailableHorse[];
  availableWranglers: AvailableWrangler[];
  saddles: Saddle[];
  counts: { total: number; draft: number; assigning: number; ready: number; active: number; completed: number; cancelled: number };
};
