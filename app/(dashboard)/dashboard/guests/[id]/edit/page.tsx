import { notFound } from "next/navigation";
import { FormShell } from "@/features/dashboard/components/form-shell";
import { GuestForm } from "@/features/guests/components/guest-form";
import { getGuest } from "@/features/guests/services/guest-service";
import { listReservationOptions } from "@/features/reservations/services/reservation-service";
export default async function EditGuestPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [guest, reservations] = await Promise.all([getGuest(id), listReservationOptions()]); if (!guest) notFound(); return <FormShell title="Edit guest" description="Update guest stay, rider, and contact details." backHref="/dashboard/guests"><GuestForm guest={guest} reservations={reservations} /></FormShell>; }
