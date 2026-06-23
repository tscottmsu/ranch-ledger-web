import { PawPrint, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { assignHorseAction, removeHorseAssignmentAction } from "../data/ride-actions";
import type { AvailableHorse, RideWithAssignments, Saddle } from "../types";

export function HorseAssignmentPanel({ ride, horses, saddles }: { ride: RideWithAssignments; horses: AvailableHorse[]; saddles: Saddle[] }) {
  return <section className="rounded-lg border bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2"><PawPrint className="size-5 text-orange-700" /><h2 className="text-lg font-semibold">4. Review horse and saddle assignments</h2></div>
    <p className="mt-1 text-sm text-stone-500">Defaults come from guest prep. Override only when the morning calls for it.</p>
    <div className="mt-4 space-y-3">
      {ride.guests.length ? ride.guests.map((rideGuest) => {
        const assignment = ride.horse_assignments.find((item) => item.ride_guest_id === rideGuest.id);
        const guestName = rideGuest.guest ? `${rideGuest.guest.first_name} ${rideGuest.guest.last_name}` : "Guest";
        return <div key={rideGuest.id} className="rounded-lg border bg-stone-50 p-3">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div><p className="text-sm font-semibold">{guestName}</p><p className="text-xs text-stone-500">{assignment?.horse ? `${assignment.horse.name}${assignment.saddle ? ` / ${assignment.saddle.name}` : " / saddle needed"}` : "This guest needs a horse assignment"}</p></div>
            {assignment && <form action={removeHorseAssignmentAction.bind(null, ride.id, assignment.id)}><Button type="submit" variant="ghost" size="sm"><X />Clear</Button></form>}
          </div>
          <form action={assignHorseAction.bind(null, ride.id, rideGuest.id)} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <select name="horse" defaultValue={assignment?.horse_id ?? ""} className="h-9 flex-1 rounded-lg border bg-white px-3 text-sm">
              <option value="">Choose horse</option>
              {horses.map((horse) => <option key={horse.id} value={horse.id} disabled={Boolean(horse.assigned_ride_id && horse.assigned_ride_id !== ride.id)}>{horse.name} ({horse.status}){horse.assigned_ride_name && horse.assigned_ride_id !== ride.id ? ` - on ${horse.assigned_ride_name}` : ""}</option>)}
            </select>
            <select name="saddle" defaultValue={assignment?.saddle_id ?? ""} className="h-9 rounded-lg border bg-white px-3 text-sm">
              <option value="">Choose saddle</option>
              {saddles.map((saddle) => <option key={saddle.id} value={saddle.id}>{saddle.name}{saddle.saddle_number ? ` #${saddle.saddle_number}` : ""}</option>)}
            </select>
            <Button type="submit" size="sm" className="bg-stone-950 text-white hover:bg-stone-800">Assign horse</Button>
          </form>
        </div>;
      }) : <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-stone-500">Add guests before assigning horses.</p>}
    </div>
  </section>;
}
