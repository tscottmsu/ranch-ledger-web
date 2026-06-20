import { FormShell } from "@/features/dashboard/components/form-shell";
import { TrailForm } from "@/features/trails/components/trail-form";
export default function NewTrailPage() { return <FormShell title="Add trail" description="Create a route for future ranch activities." backHref="/dashboard/trails"><TrailForm /></FormShell>; }
