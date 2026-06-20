import "server-only";

import { requireRanchAdministrator } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { Reservation, ReservationOption, ReservationStatus } from "../types";

export type ReservationInput = { reservation_name: string | null; primary_contact_name: string | null; primary_contact_phone: string | null; primary_contact_email: string | null; arrival_date: string | null; departure_date: string | null; cabin_or_lodging_notes: string | null; group_notes: string | null; status: ReservationStatus };
export type NewReservationGuest = { first_name: string; last_name: string };

export async function listReservations(): Promise<Reservation[]> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("reservations").select("*").eq("ranch_id", ranchId).order("arrival_date", { ascending: false, nullsFirst: false }); if (error) throw error; return data as Reservation[]; }
export async function listReservationOptions(): Promise<ReservationOption[]> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("reservations").select("id,reservation_name,primary_contact_name,status").eq("ranch_id", ranchId).order("reservation_name"); if (error) throw error; return data as ReservationOption[]; }
export async function getReservation(id: string): Promise<Reservation | null> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("reservations").select("*").eq("ranch_id", ranchId).eq("id", id).maybeSingle(); if (error) throw error; return data as Reservation | null; }

export async function saveReservationWithGuests(id: string | null, input: ReservationInput, guests: NewReservationGuest[]) {
  const { ranchId } = await requireRanchAdministrator();
  const supabase = await createClient();
  return supabase.rpc("save_reservation_with_guests", {
    target_ranch_id: ranchId,
    target_reservation_id: id,
    new_reservation_name: input.reservation_name,
    new_primary_contact_name: input.primary_contact_name,
    new_primary_contact_phone: input.primary_contact_phone,
    new_primary_contact_email: input.primary_contact_email,
    new_arrival_date: input.arrival_date,
    new_departure_date: input.departure_date,
    new_cabin_or_lodging_notes: input.cabin_or_lodging_notes,
    new_group_notes: input.group_notes,
    new_status: input.status,
    new_guests: guests,
  });
}

export async function archiveReservationAndLinkedGuests(id: string) {
  const { ranchId } = await requireRanchAdministrator();
  const supabase = await createClient();
  // The reservation status trigger archives linked guests in the same transaction.
  return supabase.from("reservations").update({ status: "archived" }).eq("ranch_id", ranchId).eq("id", id);
}
