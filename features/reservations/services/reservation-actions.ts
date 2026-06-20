"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { archiveReservationAndLinkedGuests, saveReservationWithGuests, type NewReservationGuest, type ReservationInput } from "./reservation-service";
import type { ReservationFormState, ReservationStatus } from "../types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parse(formData: FormData): { input?: ReservationInput; guests?: NewReservationGuest[]; state?: ReservationFormState } {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const email = value("email");
  const arrival = value("arrivalDate");
  const departure = value("departureDate");
  const firstNames = formData.getAll("guestFirstName").map((item) => String(item).trim());
  const lastNames = formData.getAll("guestLastName").map((item) => String(item).trim());
  const guests: NewReservationGuest[] = [];
  const fieldErrors: ReservationFormState["fieldErrors"] = {};

  if (email && !emailPattern.test(email)) fieldErrors.email = "Enter a valid email.";
  if (arrival && departure && departure < arrival) fieldErrors.dates = "Departure must be on or after arrival.";
  firstNames.forEach((firstName, index) => {
    const lastName = lastNames[index] ?? "";
    if ((firstName && !lastName) || (!firstName && lastName)) fieldErrors.guests = "Each added guest needs a first and last name.";
    if (firstName && lastName) guests.push({ first_name: firstName, last_name: lastName });
  });
  if (Object.keys(fieldErrors).length) return { state: { status: "error", fieldErrors } };

  return { input: { reservation_name: value("name") || null, primary_contact_name: value("contactName") || null, primary_contact_phone: value("phone") || null, primary_contact_email: email || null, arrival_date: arrival || null, departure_date: departure || null, cabin_or_lodging_notes: value("lodgingNotes") || null, group_notes: value("groupNotes") || null, status: (value("status") || "reserved") as ReservationStatus }, guests };
}

async function save(id: string | null, state: ReservationFormState, formData: FormData): Promise<ReservationFormState> {
  const parsed = parse(formData);
  if (parsed.state) return parsed.state;
  const { error } = await saveReservationWithGuests(id, parsed.input!, parsed.guests!);
  if (error) return { status: "error", message: error.message };
  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard/guests");
  revalidatePath("/dashboard");
  redirect("/dashboard/reservations");
}

export async function createReservationAction(state: ReservationFormState, formData: FormData) { return save(null, state, formData); }
export async function updateReservationAction(id: string, state: ReservationFormState, formData: FormData) { return save(id, state, formData); }
export async function archiveReservationAction(id: string) { const { error } = await archiveReservationAndLinkedGuests(id); if (error) throw new Error("Unable to archive reservation."); revalidatePath("/dashboard/reservations"); revalidatePath("/dashboard/guests"); revalidatePath("/dashboard"); }
