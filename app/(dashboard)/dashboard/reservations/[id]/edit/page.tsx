import { notFound } from "next/navigation";
import { FormShell } from "@/features/dashboard/components/form-shell";
import { ReservationForm } from "@/features/reservations/components/reservation-form";
import { getReservation } from "@/features/reservations/services/reservation-service";
import { listGuestsForReservation } from "@/features/guests/services/guest-service";
export default async function EditReservationPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [reservation, guests] = await Promise.all([getReservation(id), listGuestsForReservation(id)]); if (!reservation) notFound(); return <FormShell title="Edit reservation" description="Manage this party, its stay, and associated guests." backHref="/dashboard/reservations"><ReservationForm reservation={reservation} guests={guests} /></FormShell>; }
