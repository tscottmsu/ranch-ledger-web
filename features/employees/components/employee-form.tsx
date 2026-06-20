"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthMessage } from "@/features/authentication/components/auth-message";
import { SubmitButton } from "@/features/authentication/components/submit-button";
import { createEmployeeAction, updateEmployeeAction } from "../services/employee-actions";
import { initialEmployeeFormState, type Employee } from "../types";

type FieldProps = { label: string; name: string; error?: string; defaultValue?: string | null } & Omit<React.ComponentProps<typeof Input>, "defaultValue" | "name">;

export function EmployeeForm({ employee }: { employee?: Employee }) {
  const action = employee ? updateEmployeeAction.bind(null, employee.id) : createEmployeeAction;
  const [state, formAction] = useActionState(action, initialEmployeeFormState);
  return <form action={formAction} className="space-y-5 p-6">
    <AuthMessage state={state} />
    <div className="grid gap-5 sm:grid-cols-2"><Field label="First name" name="firstName" defaultValue={employee?.first_name} required error={state.fieldErrors?.firstName} /><Field label="Last name" name="lastName" defaultValue={employee?.last_name} required error={state.fieldErrors?.lastName} /></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Nickname" name="nickname" defaultValue={employee?.nickname} /><Field label="Position" name="position" defaultValue={employee?.position} placeholder="Head Wrangler" /></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Phone" name="phone" type="tel" defaultValue={employee?.phone} /><Field label="Email" name="email" type="email" defaultValue={employee?.email} error={state.fieldErrors?.email} /></div>
    <Field label="Hire date" name="hireDate" type="date" defaultValue={employee?.hire_date} />
    <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" defaultValue={employee?.notes ?? ""} /></div>
    <div className="pt-2 sm:w-48"><SubmitButton>{employee ? "Save changes" : "Add employee"}</SubmitButton></div>
  </form>;
}

function Field({ label, name, error, defaultValue, ...props }: FieldProps) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} defaultValue={defaultValue ?? ""} aria-invalid={Boolean(error)} {...props} />{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
