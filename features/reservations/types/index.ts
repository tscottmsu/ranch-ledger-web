export type ReservationStatus = "reserved" | "confirmed" | "checked_in" | "checked_out" | "completed" | "cancelled" | "archived";
export type Reservation = { id: string; ranch_id: string; reservation_name: string | null; primary_contact_name: string | null; primary_contact_phone: string | null; primary_contact_email: string | null; arrival_date: string | null; departure_date: string | null; cabin_or_lodging_notes: string | null; group_notes: string | null; status: ReservationStatus; created_at: string; updated_at: string };
export type ReservationWithGuests = Reservation & { guests: Array<{ first_name: string; last_name: string }> };
export type ReservationOption = Pick<Reservation, "id" | "reservation_name" | "primary_contact_name" | "status">;
export type ReservationFormState = { status: "idle" | "error"; message?: string; fieldErrors?: Partial<Record<"email" | "dates" | "guests", string>> };
export const initialReservationFormState: ReservationFormState = { status: "idle" };
