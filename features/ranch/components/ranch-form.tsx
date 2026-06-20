"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthMessage } from "@/features/authentication/components/auth-message";
import { SubmitButton } from "@/features/authentication/components/submit-button";
import { createRanchAction } from "../services/ranch-actions";
import { initialRanchFormState } from "../types";

const timezones = ["America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York", "America/Phoenix", "America/Anchorage", "Pacific/Honolulu"];

export function RanchForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, action] = useActionState(createRanchAction, initialRanchFormState);
  return (
    <form action={action} className="mt-8 space-y-5">
      <AuthMessage state={state} />
      <div className="space-y-2"><Label htmlFor="name">Ranch name</Label><Input id="name" name="name" autoComplete="organization" required aria-invalid={Boolean(state.fieldErrors?.name)} />{state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name}</p>}</div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="space-y-2"><Label htmlFor="email">Ranch email</Label><Input id="email" name="email" type="email" defaultValue={defaultEmail} autoComplete="email" aria-invalid={Boolean(state.fieldErrors?.email)} />{state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email}</p>}</div>
      </div>
      <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" autoComplete="street-address" placeholder="123 Ranch Road" /></div>
      <div className="space-y-2"><Label htmlFor="timezone">Timezone</Label><Input id="timezone" name="timezone" list="timezone-options" defaultValue="America/Chicago" required aria-invalid={Boolean(state.fieldErrors?.timezone)} /><datalist id="timezone-options">{timezones.map((timezone) => <option key={timezone} value={timezone} />)}</datalist>{state.fieldErrors?.timezone && <p className="text-sm text-destructive">{state.fieldErrors.timezone}</p>}</div>
      <SubmitButton>Create ranch and finish setup</SubmitButton>
    </form>
  );
}
