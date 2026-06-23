"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "../services/auth-actions";
import { initialAuthFormState } from "../types";
import { AuthMessage } from "./auth-message";
import { SubmitButton } from "./submit-button";

export function SignUpForm() {
  const [state, action] = useActionState(signUpAction, initialAuthFormState);
  return (
    <form action={action} className="mt-8 space-y-5">
      <AuthMessage state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="firstName">First name</Label><Input id="firstName" name="firstName" autoComplete="given-name" required aria-invalid={Boolean(state.fieldErrors?.firstName)} />{state.fieldErrors?.firstName && <p className="text-sm text-destructive">{state.fieldErrors.firstName}</p>}</div>
        <div className="space-y-2"><Label htmlFor="lastName">Last name</Label><Input id="lastName" name="lastName" autoComplete="family-name" required aria-invalid={Boolean(state.fieldErrors?.lastName)} />{state.fieldErrors?.lastName && <p className="text-sm text-destructive">{state.fieldErrors.lastName}</p>}</div>
      </div>
      <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.fieldErrors?.email)} />{state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email}</p>}</div>
      <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required aria-invalid={Boolean(state.fieldErrors?.password)} /><p className="text-xs text-muted-foreground">At least 8 characters.</p>{state.fieldErrors?.password && <p className="text-sm text-destructive">{state.fieldErrors.password}</p>}</div>
      <SubmitButton>Create administrator account</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-foreground underline underline-offset-4">Sign in</Link></p>
    </form>
  );
}
