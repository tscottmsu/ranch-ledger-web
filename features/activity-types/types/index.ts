export type ActivityType = { id: string; ranch_id: string; name: string; description: string | null; active: boolean; created_at: string; updated_at: string };
export type ActivityTypeFormState = { status: "idle" | "error"; message?: string; fieldErrors?: Partial<Record<"name", string>> };
export const initialActivityTypeFormState: ActivityTypeFormState = { status: "idle" };
