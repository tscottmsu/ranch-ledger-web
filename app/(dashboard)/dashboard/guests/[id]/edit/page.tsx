import { notFound } from "next/navigation";
import { FormShell } from "@/features/dashboard/components/form-shell";
import { GuestForm } from "@/features/guests/components/guest-form";
import { RidingAssignmentPanel } from "@/features/guests/components/riding-assignment-panel";
import { getGuest } from "@/features/guests/services/guest-service";
import { getGuestRidingAssignment, getGuestRidingAssignmentOptions } from "@/features/guests/services/riding-assignment-service";
import { listReservationOptions } from "@/features/reservations/services/reservation-service";
export default async function EditGuestPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [guest, reservations, assignment, options] = await Promise.all([getGuest(id), listReservationOptions(), getGuestRidingAssignment(id), getGuestRidingAssignmentOptions()]); if (!guest) notFound(); return <FormShell title="Edit guest" description="Update guest stay, rider, and contact details." backHref="/dashboard/guests"><GuestForm guest={guest} reservations={reservations} /><RidingAssignmentPanel guestId={guest.id} reservationId={guest.reservation_id} assignment={assignment} horses={options.horses} saddles={options.saddles} /></FormShell>; }
