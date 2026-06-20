import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { TrailList } from "@/features/trails/components/trail-list";
import { listTrails } from "@/features/trails/services/trail-service";
export const metadata: Metadata = { title: "Trails" };
export default async function TrailsPage() { const trails = await listTrails(); return <><PageHeader title="Trails" description="Configure ranch routes and their operating characteristics." actionHref="/dashboard/trails/new" actionLabel="Add trail" /><TrailList trails={trails} /></>; }
