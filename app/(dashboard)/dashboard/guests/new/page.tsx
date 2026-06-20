import { FormShell } from "@/features/dashboard/components/form-shell";
import { GuestForm } from "@/features/guests/components/guest-form";
import { listReservationOptions } from "@/features/reservations/services/reservation-service";
export default async function NewGuestPage() { const reservations = await listReservationOptions(); return <FormShell title="Add guest" description="Create an individual guest record for this ranch." backHref="/dashboard/guests"><GuestForm reservations={reservations} /></FormShell>; }
