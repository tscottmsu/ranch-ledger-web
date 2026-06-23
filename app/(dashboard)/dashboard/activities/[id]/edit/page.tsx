import { notFound } from "next/navigation";
import { ActivityForm } from "@/features/activities/components/activity-form";
import { getActivity, getActivityFormOptions } from "@/features/activities/services/activity-service";
import { FormShell } from "@/features/dashboard/components/form-shell";
export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [activity, options] = await Promise.all([getActivity(id), getActivityFormOptions()]); if (!activity || activity.archived_at) notFound(); return <FormShell title="Edit activity" description="Update scheduling and operational status." backHref="/dashboard/activities"><ActivityForm activity={activity} {...options} /></FormShell>; }
