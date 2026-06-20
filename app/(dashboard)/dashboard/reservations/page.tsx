import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { ReservationList } from "@/features/reservations/components/reservation-list";
import { listReservations } from "@/features/reservations/services/reservation-service";
export const metadata: Metadata = { title: "Reservations" };
export default async function ReservationsPage() { const reservations = await listReservations(); return <><PageHeader title="Reservations" description="Organize guest parties, stays, and primary contacts." actionHref="/dashboard/reservations/new" actionLabel="Add reservation" /><ReservationList reservations={reservations} /></>; }
