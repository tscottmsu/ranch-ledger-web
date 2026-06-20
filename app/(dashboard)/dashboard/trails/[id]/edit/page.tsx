import { notFound } from "next/navigation";
import { FormShell } from "@/features/dashboard/components/form-shell";
import { TrailForm } from "@/features/trails/components/trail-form";
import { getTrail } from "@/features/trails/services/trail-service";
export default async function EditTrailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const trail = await getTrail(id); if (!trail) notFound(); return <FormShell title="Edit trail" description="Update this route’s setup details." backHref="/dashboard/trails"><TrailForm trail={trail} /></FormShell>; }
