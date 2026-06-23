"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "../services/auth-actions";
import { initialAuthFormState } from "../types";
import { AuthMessage } from "./auth-message";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialAuthFormState);
  return (
    <div>
      <p className="text-sm font-semibold text-primary">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to your ranch</h1>
      <p className="mt-2 text-sm text-muted-foreground">Use the email and password connected to your account.</p>
      <form action={action} className="mt-8 space-y-5">
        <AuthMessage state={state} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.fieldErrors?.email)} />
          {state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required aria-invalid={Boolean(state.fieldErrors?.password)} />
          {state.fieldErrors?.password && <p className="text-sm text-destructive">{state.fieldErrors.password}</p>}
        </div>
        <SubmitButton>Sign in</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to Ranch Ledger? <Link href="/onboarding" className="font-medium text-foreground underline underline-offset-4">Set up your ranch</Link></p>
    </div>
  );
}
