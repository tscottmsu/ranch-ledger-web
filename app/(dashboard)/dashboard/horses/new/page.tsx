import { FormShell } from "@/features/dashboard/components/form-shell";
import { HorseForm } from "@/features/horses/components/horse-form";
export default function NewHorsePage() { return <FormShell title="Add horse" description="Create a horse record for this ranch." backHref="/dashboard/horses"><HorseForm /></FormShell>; }
