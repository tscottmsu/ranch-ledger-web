import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { GuestList } from "@/features/guests/components/guest-list";
import { listGuests } from "@/features/guests/services/guest-service";
export const metadata: Metadata = { title: "Guests" };
export default async function GuestsPage() { const guests = await listGuests(); return <><PageHeader title="Guests" description="Manage individual guest stays, rider details, and status." actionHref="/dashboard/guests/new" actionLabel="Add guest" /><GuestList guests={guests} /></>; }
