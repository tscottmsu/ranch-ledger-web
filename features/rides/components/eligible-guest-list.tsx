import { UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addGuestToRideAction, removeGuestFromRideAction } from "../data/ride-actions";
import type { EligibleRideGuest, RideWithAssignments } from "../types";

export function EligibleGuestList({ ride, guests }: { ride: RideWithAssignments; guests: EligibleRideGuest[] }) {
  const assignedGuestIds = new Set(ride.guests.map((item) => item.guest_id));
  const choices = guests.filter((guest) => !assignedGuestIds.has(guest.id) || guest.assigned_ride_id === ride.id);
  return <section className="rounded-lg border bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2"><UserPlus className="size-5 text-orange-700" /><h2 className="text-lg font-semibold">2. Add guests</h2></div>
    <p className="mt-1 text-sm text-stone-500">Assign guests before the horses are saddled.</p>
    <form action={addGuestToRideAction.bind(null, ride.id)} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <select name="guest" className="h-10 flex-1 rounded-lg border bg-white px-3 text-sm">
        <option value="">Choose an arriving or checked-in guest</option>
        {choices.map((guest) => <option key={guest.id} value={guest.id} disabled={Boolean(guest.assigned_ride_id && guest.assigned_ride_id !== ride.id)}>{guest.first_name} {guest.last_name}{guest.assigned_ride_name && guest.assigned_ride_id !== ride.id ? ` - on ${guest.assigned_ride_name}` : ""}</option>)}
      </select>
      <Button type="submit" className="bg-orange-700 text-white hover:bg-orange-800">Add guest</Button>
    </form>
    <div className="mt-4 divide-y rounded-lg border">
      {ride.guests.length ? ride.guests.map((rideGuest) => <div key={rideGuest.id} className="flex items-center justify-between gap-3 px-3 py-2">
        <div><p className="text-sm font-medium">{rideGuest.guest ? `${rideGuest.guest.first_name} ${rideGuest.guest.last_name}` : "Guest"}</p><p className="text-xs text-stone-500">{rideGuest.guest?.riding_experience ?? "Experience not noted"}</p></div>
        <form action={removeGuestFromRideAction.bind(null, ride.id, rideGuest.id)}><Button type="submit" variant="ghost" size="sm"><X />Remove</Button></form>
      </div>) : <p className="px-3 py-4 text-sm text-stone-500">No guests assigned yet.</p>}
    </div>
  </section>;
}
