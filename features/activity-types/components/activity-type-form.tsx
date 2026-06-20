"use client";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthMessage } from "@/features/authentication/components/auth-message";
import { SubmitButton } from "@/features/authentication/components/submit-button";
import { createActivityTypeAction, updateActivityTypeAction } from "../services/activity-type-actions";
import { initialActivityTypeFormState, type ActivityType } from "../types";
export function ActivityTypeForm({ activityType }: { activityType?: ActivityType }) { const action = activityType ? updateActivityTypeAction.bind(null, activityType.id) : createActivityTypeAction; const [state, formAction] = useActionState(action, initialActivityTypeFormState); return <form action={formAction} className="space-y-5 p-6"><AuthMessage state={state} /><div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={activityType?.name ?? ""} placeholder="Guided Ride" required aria-invalid={Boolean(state.fieldErrors?.name)} />{state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name}</p>}</div><div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={activityType?.description ?? ""} /></div><div className="space-y-2"><Label htmlFor="active">Status</Label><select id="active" name="active" defaultValue={activityType?.active === false ? "false" : "true"} className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="true">Active</option><option value="false">Archived</option></select></div><div className="pt-2 sm:w-48"><SubmitButton>{activityType ? "Save changes" : "Add activity type"}</SubmitButton></div></form>; }
