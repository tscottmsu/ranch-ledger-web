import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { HorseList } from "@/features/horses/components/horse-list";
import { listHorses } from "@/features/horses/services/horse-service";
export const metadata: Metadata = { title: "Horses" };
export default async function HorsesPage() { const horses = await listHorses(); return <><PageHeader title="Horses" description="Maintain the horse roster and availability details." actionHref="/dashboard/horses/new" actionLabel="Add horse" /><HorseList horses={horses} /></>; }
