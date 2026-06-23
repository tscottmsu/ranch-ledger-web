import { Button } from "@/components/ui/button";
import type { Guest } from "@/features/guests/types";
import { saveGuestRidingAssignmentAction } from "../services/riding-assignment-actions";
import type { Horse } from "@/features/horses/types";
import type { ReservationGuestAssignment } from "@/features/rides/types";
import type { Saddle } from "@/features/saddles/types";
import { getSaddleRecommendations } from "@/features/saddles/data/saddle-recommendation-service";

export function RidingAssignmentPanel({ guest, assignment, horses, saddles }: { guest: Guest; assignment: ReservationGuestAssignment | null; horses: Horse[]; saddles: Saddle[] }) {
  const { message, recommendations } = getSaddleRecommendations(guest, saddles);
  const recommendedIds = new Set(recommendations.map((item) => item.saddle.id));
  return <section className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold">Riding assignment</h2>
    <p className="mt-1 text-sm text-stone-500">Set the guest&apos;s usual horse, saddle, and riding notes before morning rides.</p>
    {!guest.reservation_id ? <p className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-900">Add this guest to a reservation before setting ride prep.</p> : <form action={saveGuestRidingAssignmentAction.bind(null, guest.id, guest.reservation_id)} className="mt-4 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-stone-700">Horse
          <select name="horse" defaultValue={assignment?.horse_id ?? ""} className="h-10 rounded-lg border bg-white px-3 text-sm">
            <option value="">Needs horse assignment</option>
            {horses.map((horse) => <option key={horse.id} value={horse.id}>{horse.name} ({horse.status})</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-stone-700">Saddle
          <select name="saddle" defaultValue={assignment?.saddle_id ?? ""} className="h-10 rounded-lg border bg-white px-3 text-sm">
            <option value="">Needs saddle assignment</option>
            {recommendations.map(({ saddle }) => <option key={saddle.id} value={saddle.id}>{saddle.name}{saddle.saddle_number ? ` #${saddle.saddle_number}` : ""} - recommended</option>)}
            {saddles.filter((saddle) => !recommendedIds.has(saddle.id)).map((saddle) => <option key={saddle.id} value={saddle.id}>{saddle.name}{saddle.saddle_number ? ` #${saddle.saddle_number}` : ""}</option>)}
          </select>
          {message ? <span className="text-xs text-orange-800">{message}</span> : <span className="text-xs text-emerald-700">Recommended for this guest: {recommendations[0]?.saddle.name}</span>}
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium text-stone-700">Riding ability
        <input name="ridingAbility" defaultValue={assignment?.riding_ability ?? ""} placeholder="Beginner, steady walk/trot, confident rider" className="h-10 rounded-lg border bg-white px-3 text-sm" />
      </label>
      <label className="grid gap-1 text-sm font-medium text-stone-700">Riding notes
        <textarea name="notes" defaultValue={assignment?.notes ?? ""} rows={3} className="rounded-lg border bg-white px-3 py-2 text-sm" />
      </label>
      <div><Button type="submit" className="bg-orange-700 text-white hover:bg-orange-800">Save ride prep</Button></div>
    </form>}
  </section>;
}
