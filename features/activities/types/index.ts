export type ActivityStatus = "draft" | "ready" | "in_progress" | "completed" | "cancelled";
export type Activity = { id: string; ranch_id: string; activity_type_id: string; trail_id: string | null; name: string | null; activity_date: string; start_time: string | null; end_time: string | null; status: ActivityStatus; capacity: number | null; notes: string | null; created_by: string | null; archived_at: string | null; created_at: string; updated_at: string };
export type ActivityWithRelations = Activity & { activity_type: { name: string } | null; trail: { name: string } | null };
export type ActivityOption = { id: string; name: string };
export type ActivityFormState = { status: "idle" | "error"; message?: string; fieldErrors?: Partial<Record<"activityType" | "date" | "times" | "capacity", string>> };
export const initialActivityFormState: ActivityFormState = { status: "idle" };
