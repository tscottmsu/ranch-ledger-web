"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthMessage } from "@/features/authentication/components/auth-message";
import { SubmitButton } from "@/features/authentication/components/submit-button";
import { createHorseAction, updateHorseAction } from "../services/horse-actions";
import { initialHorseFormState, type Horse } from "../types";

type FieldProps = { label: string; name: string; error?: string; defaultValue?: string | null } & Omit<React.ComponentProps<typeof Input>, "defaultValue" | "name">;

export function HorseForm({ horse }: { horse?: Horse }) {
  const action = horse ? updateHorseAction.bind(null, horse.id) : createHorseAction;
  const [state, formAction] = useActionState(action, initialHorseFormState);
  return <form action={formAction} className="space-y-5 p-6">
    <AuthMessage state={state} />
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" defaultValue={horse?.name} required error={state.fieldErrors?.name} /><Field label="Barn name" name="barnName" defaultValue={horse?.barn_name} /></div>
    <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" name="status" defaultValue={horse?.status ?? "active"} className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="active">Active</option><option value="unavailable">Unavailable</option><option value="retired">Retired</option><option value="inactive">Inactive</option></select></div><Field label="Maximum rider weight (lbs)" name="weight" type="number" min={1} step={1} defaultValue={horse?.max_rider_weight_lbs?.toString()} error={state.fieldErrors?.weight} /></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Temperament" name="temperament" defaultValue={horse?.temperament} placeholder="Calm, energetic…" /><Field label="Experience level" name="experienceLevel" defaultValue={horse?.experience_level} placeholder="Beginner-friendly" /></div>
    <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" defaultValue={horse?.notes ?? ""} /></div>
    <div className="pt-2 sm:w-48"><SubmitButton>{horse ? "Save changes" : "Add horse"}</SubmitButton></div>
  </form>;
}

function Field({ label, name, error, defaultValue, ...props }: FieldProps) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} defaultValue={defaultValue ?? ""} aria-invalid={Boolean(error)} {...props} />{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
