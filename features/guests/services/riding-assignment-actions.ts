"use server";

import { revalidatePath } from "next/cache";
import { saveGuestRidingAssignment } from "./riding-assignment-service";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveGuestRidingAssignmentAction(guestId: string, reservationId: string, formData: FormData) {
  if (!reservationId) throw new Error("Add this guest to a reservation before setting ride prep.");
  const { error } = await saveGuestRidingAssignment({
    guest_id: guestId,
    reservation_id: reservationId,
    horse_id: value(formData, "horse") || null,
    saddle_id: value(formData, "saddle") || null,
    riding_ability: value(formData, "ridingAbility") || null,
    notes: value(formData, "notes") || null,
  });
  if (error) throw new Error("Unable to save ride prep.");
  revalidatePath(`/dashboard/guests/${guestId}/edit`);
  revalidatePath("/dashboard/operations");
}
