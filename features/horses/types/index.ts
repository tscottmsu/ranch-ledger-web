export type HorseStatus = "active" | "inactive" | "retired" | "unavailable";
export type Horse = { id: string; ranch_id: string; name: string; barn_name: string | null; status: HorseStatus; max_rider_weight_lbs: number | null; temperament: string | null; experience_level: string | null; notes: string | null; created_at: string; updated_at: string };
export type HorseFormState = { status: "idle" | "error"; message?: string; fieldErrors?: Partial<Record<"name" | "weight", string>> };
export const initialHorseFormState: HorseFormState = { status: "idle" };
