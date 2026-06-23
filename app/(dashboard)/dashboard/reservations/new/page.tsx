import { FormShell } from "@/features/dashboard/components/form-shell";
import { ReservationForm } from "@/features/reservations/components/reservation-form";
export default function NewReservationPage() { return <FormShell title="Add reservation" description="Create an optional grouping for one or more guests." backHref="/dashboard/reservations"><ReservationForm /></FormShell>; }
