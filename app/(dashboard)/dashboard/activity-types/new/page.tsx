import { ActivityTypeForm } from "@/features/activity-types/components/activity-type-form";
import { FormShell } from "@/features/dashboard/components/form-shell";
export default function NewActivityTypePage() { return <FormShell title="Add activity type" description="Define an offering without scheduling any activities yet." backHref="/dashboard/activity-types"><ActivityTypeForm /></FormShell>; }
