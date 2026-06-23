"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthMessage } from "@/features/authentication/components/auth-message";
import { SubmitButton } from "@/features/authentication/components/submit-button";
import { createSaddleAction, updateSaddleAction } from "../data/saddle-actions";
import { initialSaddleFormState, type Saddle } from "../types";

type FieldProps = { label: string; name: string; error?: string; defaultValue?: string | null } & Omit<React.ComponentProps<typeof Input>, "defaultValue" | "name">;

export function SaddleForm({ saddle }: { saddle?: Saddle }) {
  const action = saddle ? updateSaddleAction.bind(null, saddle.id) : createSaddleAction;
  const [state, formAction] = useActionState(action, initialSaddleFormState);
  return <form action={formAction} className="space-y-5 p-6">
    <AuthMessage state={state} />
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" defaultValue={saddle?.name} required error={state.fieldErrors?.name} /><Field label="Saddle number" name="saddleNumber" defaultValue={saddle?.saddle_number} /></div>
    <div className="grid gap-5 sm:grid-cols-3"><Field label="Type" name="type" defaultValue={saddle?.type} placeholder="Western, trail, youth" /><Field label="Seat size" name="seatSize" defaultValue={saddle?.seat_size} /><div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" name="status" defaultValue={saddle?.status ?? "active"} className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="active">Active</option><option value="repair">Repair</option><option value="inactive">Inactive</option><option value="retired">Retired</option></select></div></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Best fit height range - min inches" name="heightMin" type="number" min={1} step="0.5" defaultValue={saddle?.rider_height_min?.toString()} error={state.fieldErrors?.height} /><Field label="Best fit height range - max inches" name="heightMax" type="number" min={1} step="0.5" defaultValue={saddle?.rider_height_max?.toString()} error={state.fieldErrors?.height} /></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Best fit weight range - min lbs" name="weightMin" type="number" min={1} step="1" defaultValue={saddle?.rider_weight_min?.toString()} error={state.fieldErrors?.weight} /><Field label="Best fit weight range - max lbs" name="weightMax" type="number" min={1} step="1" defaultValue={saddle?.rider_weight_max?.toString()} error={state.fieldErrors?.weight} /></div>
    <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" defaultValue={saddle?.notes ?? ""} /></div>
    <div className="pt-2 sm:w-48"><SubmitButton>{saddle ? "Save changes" : "Add saddle"}</SubmitButton></div>
  </form>;
}

function Field({ label, name, error, defaultValue, ...props }: FieldProps) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} defaultValue={defaultValue ?? ""} aria-invalid={Boolean(error)} {...props} />{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
