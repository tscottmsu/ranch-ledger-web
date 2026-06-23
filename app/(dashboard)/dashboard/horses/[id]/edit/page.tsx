import { notFound } from "next/navigation";
import { FormShell } from "@/features/dashboard/components/form-shell";
import { HorseForm } from "@/features/horses/components/horse-form";
import { getHorse } from "@/features/horses/services/horse-service";
export default async function EditHorsePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const horse = await getHorse(id); if (!horse) notFound(); return <FormShell title="Edit horse" description="Update this horse’s profile and availability." backHref="/dashboard/horses"><HorseForm horse={horse} /></FormShell>; }
