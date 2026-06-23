import { notFound } from "next/navigation";
import { ActivityTypeForm } from "@/features/activity-types/components/activity-type-form";
import { getActivityType } from "@/features/activity-types/services/activity-type-service";
import { FormShell } from "@/features/dashboard/components/form-shell";
export default async function EditActivityTypePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const activityType = await getActivityType(id); if (!activityType) notFound(); return <FormShell title="Edit activity type" description="Update this ranch offering." backHref="/dashboard/activity-types"><ActivityTypeForm activityType={activityType} /></FormShell>; }
