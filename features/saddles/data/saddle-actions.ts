"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { archiveSaddle, createSaddle, updateSaddle, type SaddleInput } from "./saddle-service";
import type { SaddleFormState, SaddleStatus } from "../types";

const statuses: SaddleStatus[] = ["active", "inactive", "repair", "retired"];

function numberValue(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  return raw ? Number(raw) : null;
}

function parse(formData: FormData): { input?: SaddleInput; state?: SaddleFormState } {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const name = value("name");
  const heightMin = numberValue(formData, "heightMin");
  const heightMax = numberValue(formData, "heightMax");
  const weightMin = numberValue(formData, "weightMin");
  const weightMax = numberValue(formData, "weightMax");
  const fieldErrors: SaddleFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Saddle name is required.";
  if (heightMin !== null && heightMax !== null && heightMax < heightMin) fieldErrors.height = "Height range must end above where it starts.";
  if (weightMin !== null && weightMax !== null && weightMax < weightMin) fieldErrors.weight = "Weight range must end above where it starts.";
  if (Object.keys(fieldErrors).length) return { state: { status: "error", fieldErrors } };
  const status = value("status") as SaddleStatus;
  return { input: { name, saddle_number: value("saddleNumber") || null, type: value("type") || null, seat_size: value("seatSize") || null, rider_height_min: heightMin, rider_height_max: heightMax, rider_weight_min: weightMin, rider_weight_max: weightMax, status: statuses.includes(status) ? status : "active", notes: value("notes") || null } };
}

export async function createSaddleAction(_state: SaddleFormState, formData: FormData): Promise<SaddleFormState> {
  const parsed = parse(formData);
  if (parsed.state) return parsed.state;
  const { error } = await createSaddle(parsed.input!);
  if (error) return { status: "error", message: error.message };
  revalidatePath("/dashboard/saddles");
  redirect("/dashboard/saddles");
}

export async function updateSaddleAction(id: string, _state: SaddleFormState, formData: FormData): Promise<SaddleFormState> {
  const parsed = parse(formData);
  if (parsed.state) return parsed.state;
  const { error } = await updateSaddle(id, parsed.input!);
  if (error) return { status: "error", message: error.message };
  revalidatePath("/dashboard/saddles");
  redirect("/dashboard/saddles");
}

export async function archiveSaddleAction(id: string) {
  const { error } = await archiveSaddle(id);
  if (error) throw new Error("Unable to archive saddle.");
  revalidatePath("/dashboard/saddles");
}
