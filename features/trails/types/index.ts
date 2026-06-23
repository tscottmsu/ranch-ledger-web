export type Trail = { id: string; ranch_id: string; name: string; difficulty: string | null; estimated_duration_minutes: number | null; description: string | null; notes: string | null; active: boolean; created_at: string; updated_at: string };
export type TrailFormState = { status: "idle" | "error"; message?: string; fieldErrors?: Partial<Record<"name" | "duration", string>> };
export const initialTrailFormState: TrailFormState = { status: "idle" };
