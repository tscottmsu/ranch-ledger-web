import { ActivityForm } from "@/features/activities/components/activity-form";
import { getActivityFormOptions } from "@/features/activities/services/activity-service";
import { FormShell } from "@/features/dashboard/components/form-shell";
export default async function NewActivityPage() { const options = await getActivityFormOptions(); return <FormShell title="Schedule activity" description="Add an event to the ranch operations calendar." backHref="/dashboard/activities"><ActivityForm {...options} /></FormShell>; }
