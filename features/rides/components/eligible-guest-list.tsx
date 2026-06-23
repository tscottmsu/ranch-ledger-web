"use client";

import { useMemo, useState } from "react";
import { Search, UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addGuestsToRideAction, removeGuestFromRideAction } from "../data/ride-actions";
import type { EligibleRideGuest, RideWithAssignments } from "../types";

export function EligibleGuestList({ ride, guests }: { ride: RideWithAssignments; guests: EligibleRideGuest[] }) {
  const [query, setQuery] = useState("");
  const assignedGuestIds = useMemo(() => new Set(ride.guests.map((item) => item.guest_id)), [ride.guests]);
  const choices = useMemo(() => guests.filter((guest) => !assignedGuestIds.has(guest.id) || guest.assigned_ride_id === ride.id).filter((guest) => `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(query.toLowerCase())), [assignedGuestIds, guests, query, ride.id]);
  return <section className="rounded-lg border bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2"><UserPlus className="size-5 text-orange-700" /><h2 className="text-lg font-semibold">3. Build the ride roster</h2></div>
    <p className="mt-1 text-sm text-stone-500">Use assigned horses from guest prep, then review tack before the ride leaves the yard.</p>
    <form action={addGuestsToRideAction.bind(null, ride.id)} className="mt-4 space-y-3">
      <label className="flex h-10 items-center gap-2 rounded-lg border bg-white px-3 text-sm text-stone-500"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guests" className="h-full flex-1 bg-transparent text-stone-900 outline-none" /></label>
      <div className="max-h-72 space-y-2 overflow-auto rounded-lg border bg-stone-50 p-2">
        {choices.length ? choices.map((guest) => {
          const disabled = Boolean(guest.assigned_ride_id && guest.assigned_ride_id !== ride.id);
          return <label key={guest.id} className={`flex items-start gap-3 rounded-lg bg-white p-3 text-sm shadow-sm ${disabled ? "opacity-50" : ""}`}>
            <input type="checkbox" name="guests" value={guest.id} disabled={disabled || assignedGuestIds.has(guest.id)} className="mt-1 size-4" />
            <span><span className="font-medium">{guest.first_name} {guest.last_name}</span><span className="mt-1 block text-xs text-stone-500">{guest.default_horse_name ? `${guest.default_horse_name}${guest.default_saddle_name ? ` / ${guest.default_saddle_name}` : ""}` : "This guest needs a horse assignment"}{guest.assigned_ride_name && guest.assigned_ride_id !== ride.id ? ` - on ${guest.assigned_ride_name}` : ""}</span></span>
          </label>;
        }) : <p className="p-3 text-sm text-stone-500">No guests match the roster search.</p>}
      </div>
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
