"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/authentication/services/auth-service";
import { createRanchWithAdministrator } from "./ranch-service";
import type { RanchFormState } from "../types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createRanchAction(_state: RanchFormState, formData: FormData): Promise<RanchFormState> {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const input = { name: value("name"), phone: value("phone"), email: value("email").toLowerCase(), address: value("address"), timezone: value("timezone") };
  const fieldErrors: RanchFormState["fieldErrors"] = {};
  if (!input.name) fieldErrors.name = "Enter the ranch name.";
  if (input.email && !emailPattern.test(input.email)) fieldErrors.email = "Enter a valid email address.";
  if (!input.timezone) fieldErrors.timezone = "Choose a timezone.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };

  const { user } = await getCurrentUser();
  if (!user) redirect("/login");

  const { error } = await createRanchWithAdministrator(input);
  if (error) return { status: "error", message: error.message };
  redirect("/dashboard");
}
