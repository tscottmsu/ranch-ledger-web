export type SaddleStatus = "active" | "inactive" | "repair" | "retired";
export type Saddle = { id: string; ranch_id: string; name: string; saddle_number: string | null; type: string | null; seat_size: string | null; rider_height_min: number | null; rider_height_max: number | null; rider_weight_min: number | null; rider_weight_max: number | null; status: SaddleStatus; notes: string | null; archived_at: string | null; created_at: string; updated_at: string };
export type SaddleFormState = { status: "idle" | "error"; message?: string; fieldErrors?: Partial<Record<"name" | "height" | "weight", string>> };
export const initialSaddleFormState: SaddleFormState = { status: "idle" };
