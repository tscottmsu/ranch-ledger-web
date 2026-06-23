"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { signInWithPassword, signOut, signUp } from "./auth-service";
import type { AuthFormState } from "../types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (!emailPattern.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };

  const { error } = await signInWithPassword(email, password);
  if (error) return { status: "error", message: "Email or password is incorrect." };

  redirect("/dashboard");
}

export async function signUpAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (!firstName) fieldErrors.firstName = "Enter your first name.";
  if (!lastName) fieldErrors.lastName = "Enter your last name.";
  if (!emailPattern.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const { data, error } = await signUp({
    email,
    password,
    firstName,
    lastName,
    emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
  });

  if (error) return { status: "error", message: error.message };
  if (data.session) redirect("/onboarding");

  return {
    status: "success",
    message: "Check your email to confirm your account, then return to finish ranch setup.",
  };
}

export async function logoutAction() {
  await signOut();
  redirect("/login");
}
