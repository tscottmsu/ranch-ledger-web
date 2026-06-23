"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus, Unlink, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthMessage } from "@/features/authentication/components/auth-message";
import { SubmitButton } from "@/features/authentication/components/submit-button";
import { removeGuestFromReservationAction } from "@/features/guests/services/guest-actions";
import type { Guest } from "@/features/guests/types";
import { createReservationAction, updateReservationAction } from "../services/reservation-actions";
import { initialReservationFormState, type Reservation } from "../types";

type FieldProps = { label: string; name: string; error?: string; defaultValue?: string | null } & Omit<React.ComponentProps<typeof Input>, "defaultValue" | "name">;

export function ReservationForm({ reservation, guests = [] }: { reservation?: Reservation; guests?: Guest[] }) {
  const action = reservation ? updateReservationAction.bind(null, reservation.id) : createReservationAction;
  const [state, formAction] = useActionState(action, initialReservationFormState);
  const [guestRows, setGuestRows] = useState([0]);

  return <div>
    {reservation && <section className="border-b bg-muted/20 p-6"><div className="flex items-end justify-between gap-4"><div><h2 className="font-semibold">Guests in this reservation</h2><p className="mt-1 text-sm text-muted-foreground">Edit guest details or remove a guest from this party without deleting their record.</p></div><span className="text-sm font-medium text-muted-foreground">{guests.length} guest{guests.length === 1 ? "" : "s"}</span></div>{guests.length ? <ul className="mt-4 divide-y rounded-xl border bg-card">{guests.map((guest) => <li key={guest.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"><div><p className="font-medium">{guest.first_name} {guest.last_name}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{guest.status.replaceAll("_", " ")}</p></div><div className="flex gap-1"><Button asChild variant="ghost" size="sm"><Link href={`/dashboard/guests/${guest.id}/edit`}><Pencil />Edit</Link></Button><form action={removeGuestFromReservationAction.bind(null, guest.id, reservation.id)}><Button type="submit" variant="ghost" size="sm"><Unlink />Remove</Button></form></div></li>)}</ul> : <p className="mt-4 rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">No guests are linked yet.</p>}</section>}

    <form action={formAction} className="space-y-5 p-6">
      <AuthMessage state={state} />
      <Field label="Reservation name" name="name" defaultValue={reservation?.reservation_name} placeholder="Smith Family" />
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Primary contact" name="contactName" defaultValue={reservation?.primary_contact_name} /><Field label="Phone" name="phone" type="tel" defaultValue={reservation?.primary_contact_phone} /></div>
      <Field label="Email" name="email" type="email" defaultValue={reservation?.primary_contact_email} error={state.fieldErrors?.email} />
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Arrival date" name="arrivalDate" type="date" defaultValue={reservation?.arrival_date} error={state.fieldErrors?.dates} /><Field label="Departure date" name="departureDate" type="date" defaultValue={reservation?.departure_date} error={state.fieldErrors?.dates} /></div>
      <div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" name="status" defaultValue={reservation?.status ?? "reserved"} className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="reserved">Reserved</option><option value="confirmed">Confirmed</option><option value="checked_in">Checked in</option><option value="checked_out">Checked out</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="archived">Archived</option></select><p className="text-xs text-muted-foreground">Checking in, checking out, or archiving this reservation updates every linked guest.</p></div>
      <div className="space-y-2"><Label htmlFor="lodgingNotes">Cabin or lodging notes</Label><Textarea id="lodgingNotes" name="lodgingNotes" defaultValue={reservation?.cabin_or_lodging_notes ?? ""} /></div>
      <div className="space-y-2"><Label htmlFor="groupNotes">Group notes</Label><Textarea id="groupNotes" name="groupNotes" defaultValue={reservation?.group_notes ?? ""} /></div>

      <section className="rounded-xl border bg-muted/20 p-4"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">Add guests to this party</h2><p className="mt-1 text-xs text-muted-foreground">New guest records are created and linked when you save.</p></div><Button type="button" variant="outline" size="sm" onClick={() => setGuestRows((rows) => [...rows, Math.max(...rows) + 1])}><Plus />Add row</Button></div><div className="mt-4 space-y-3">{guestRows.map((row, index) => <div key={row} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><Input name="guestFirstName" placeholder="First name" aria-label={`Guest ${index + 1} first name`} /><Input name="guestLastName" placeholder="Last name" aria-label={`Guest ${index + 1} last name`} />{guestRows.length > 1 ? <Button type="button" variant="ghost" size="icon" aria-label={`Remove guest row ${index + 1}`} onClick={() => setGuestRows((rows) => rows.filter((item) => item !== row))}><X /></Button> : <span className="hidden size-8 sm:block" />}</div>)}</div>{state.fieldErrors?.guests && <p className="mt-3 text-sm text-destructive">{state.fieldErrors.guests}</p>}</section>

      <div className="pt-2 sm:w-52"><SubmitButton>{reservation ? "Save reservation" : "Create reservation"}</SubmitButton></div>
    </form>
  </div>;
}

function Field({ label, name, error, defaultValue, ...props }: FieldProps) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} defaultValue={defaultValue ?? ""} aria-invalid={Boolean(error)} {...props} />{error && <p className="text-sm text-destructive">{error}</p>}</div>; }
