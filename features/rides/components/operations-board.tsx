import { CalendarX, Mountain, UsersRound } from "lucide-react";

import type { RideOperationsSnapshot, RideStatus } from "../types";
import { CreateRideDialog } from "./create-ride-dialog";
import { RideCard } from "./ride-card";

const statusGroups: Array<{ status: RideStatus; label: string; helper: string }> = [
  { status: "draft", label: "Draft rides", helper: "Build the plan before guests gather." },
  { status: "assigning", label: "Assigning", helper: "Guests, horses, trail, and wranglers are being matched." },
  { status: "ready", label: "Ready", helper: "Ready to leave when the crew calls it." },
  { status: "active", label: "On trail", helper: "Rides currently out." },
  { status: "completed", label: "Wrapped", helper: "Completed rides for the day." },
  { status: "cancelled", label: "Cancelled", helper: "Kept for the day's record." },
];

const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function OperationsBoard({ snapshot }: { snapshot: RideOperationsSnapshot }) {
  return <div className="space-y-8">
    <section className="rounded-lg bg-stone-950 px-5 py-6 text-white shadow-sm sm:px-7">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-300">Ride Operations</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Build today&apos;s ride board</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">{formatDate(snapshot.date)} - {snapshot.timezone.replaceAll("_", " ")}. Assign guests before the horses are saddled and resolve blocking warnings before marking rides ready.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-lg bg-white/10 px-4 py-3"><p className="text-2xl font-semibold">{snapshot.counts.ready}</p><p className="text-stone-300">Ready</p></div>
          <div className="rounded-lg bg-white/10 px-4 py-3"><p className="text-2xl font-semibold">{snapshot.counts.assigning + snapshot.counts.draft}</p><p className="text-stone-300">Building</p></div>
          <div className="rounded-lg bg-white/10 px-4 py-3"><p className="text-2xl font-semibold">{snapshot.eligibleGuests.length}</p><p className="text-stone-300">Guests</p></div>
        </div>
      </div>
    </section>
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        <CreateRideDialog date={snapshot.date} trails={snapshot.trails} />
        {snapshot.rides.length ? statusGroups.map((group) => {
          const rides = snapshot.rides.filter((ride) => ride.status === group.status);
          if (!rides.length) return null;
          return <section key={group.status}>
            <div className="mb-3"><h2 className="text-lg font-semibold text-stone-950">{group.label}</h2><p className="text-sm text-stone-500">{group.helper}</p></div>
            <div className="grid gap-4 lg:grid-cols-2">{rides.map((ride) => <RideCard key={ride.id} ride={ride} />)}</div>
          </section>;
        }) : <div className="rounded-lg border border-dashed bg-white p-12 text-center">
          <CalendarX className="mx-auto size-10 text-orange-700" />
          <h2 className="mt-4 text-lg font-semibold">No rides built for today yet</h2>
          <p className="mt-2 text-sm text-stone-500">Build today&apos;s morning ride, then add guests, horses, trail, and wranglers.</p>
        </div>}
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><UsersRound className="size-5 text-orange-700" /><div><h2 className="font-semibold">Ride desk queue</h2><p className="text-xs text-stone-500">{snapshot.eligibleGuests.length} guests available today</p></div></div>
          <div className="mt-4 max-h-80 space-y-2 overflow-auto">
            {snapshot.eligibleGuests.length ? snapshot.eligibleGuests.map((guest) => <div key={guest.id} className="rounded-lg bg-stone-50 px-3 py-2 text-sm"><p className="font-medium">{guest.first_name} {guest.last_name}</p><p className="text-xs text-stone-500">{guest.assigned_ride_name ? `Assigned to ${guest.assigned_ride_name}` : guest.status.replaceAll("_", " ")}</p></div>) : <p className="rounded-lg bg-stone-50 p-3 text-sm text-stone-500">No eligible guests in the queue.</p>}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><Mountain className="size-5 text-orange-700" /><div><h2 className="font-semibold">Trail notes</h2><p className="text-xs text-stone-500">{snapshot.trails.length} active trails</p></div></div>
          <p className="mt-4 text-sm leading-6 text-stone-600">Trail recommendation is a placeholder in Sprint 5. Pick the route that fits the group, then review difficulty warnings in the builder.</p>
        </div>
      </aside>
    </div>
  </div>;
}
