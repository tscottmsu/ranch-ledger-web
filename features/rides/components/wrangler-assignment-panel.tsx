import { Shield, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { assignWranglerAction, removeWranglerAssignmentAction } from "../data/ride-actions";
import type { AvailableWrangler, RideWithAssignments } from "../types";

export function WranglerAssignmentPanel({ ride, wranglers }: { ride: RideWithAssignments; wranglers: AvailableWrangler[] }) {
  return <section className="rounded-lg border bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2"><Shield className="size-5 text-orange-700" /><h2 className="text-lg font-semibold">1. Assign wranglers</h2></div>
    <p className="mt-1 text-sm text-stone-500">Pick a lead and add assistants as the ride size demands.</p>
    <form action={assignWranglerAction.bind(null, ride.id)} className="mt-4 grid gap-3 sm:grid-cols-[1fr_10rem_auto]">
      <select name="wrangler" className="h-10 rounded-lg border bg-white px-3 text-sm">
        <option value="">Choose wrangler</option>
        {wranglers.map((wrangler) => <option key={wrangler.id} value={wrangler.id} disabled={Boolean(wrangler.assigned_ride_id && wrangler.assigned_ride_id !== ride.id)}>{wrangler.first_name} {wrangler.last_name}{wrangler.assigned_ride_name && wrangler.assigned_ride_id !== ride.id ? ` - on ${wrangler.assigned_ride_name}` : ""}</option>)}
      </select>
      <select name="role" defaultValue="lead" className="h-10 rounded-lg border bg-white px-3 text-sm"><option value="lead">Lead</option><option value="assistant">Assistant</option></select>
      <Button type="submit" className="bg-orange-700 text-white hover:bg-orange-800">Assign</Button>
    </form>
    <div className="mt-4 divide-y rounded-lg border">
      {ride.wrangler_assignments.length ? ride.wrangler_assignments.map((assignment) => <div key={assignment.id} className="flex items-center justify-between gap-3 px-3 py-2">
        <div><p className="text-sm font-medium">{assignment.employee ? `${assignment.employee.first_name} ${assignment.employee.last_name}` : "Wrangler"}</p><p className="text-xs capitalize text-stone-500">{assignment.role}</p></div>
        <form action={removeWranglerAssignmentAction.bind(null, ride.id, assignment.id)}><Button type="submit" variant="ghost" size="sm"><X />Remove</Button></form>
      </div>) : <p className="px-3 py-4 text-sm text-stone-500">No wranglers assigned yet.</p>}
    </div>
  </section>;
}
