import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { assignTrailAction } from "../data/ride-actions";
import type { RideTrailOption, RideWithAssignments } from "../types";

export function TrailAssignmentPanel({ ride, trails }: { ride: RideWithAssignments; trails: RideTrailOption[] }) {
  return <section className="rounded-lg border bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2"><MapPin className="size-5 text-orange-700" /><h2 className="text-lg font-semibold">2. Pick the trail</h2></div>
    <p className="mt-1 text-sm text-stone-500">Recommend a practical route, then confirm the trail for the crew.</p>
    <form action={assignTrailAction.bind(null, ride.id)} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <select name="trail" defaultValue={ride.trail_id ?? ""} className="h-10 flex-1 rounded-lg border bg-white px-3 text-sm">
        <option value="">No trail selected</option>
        {trails.map((trail) => <option key={trail.id} value={trail.id}>{trail.name}{trail.difficulty ? ` - ${trail.difficulty}` : ""}</option>)}
      </select>
      <Button type="submit" className="bg-orange-700 text-white hover:bg-orange-800">Assign trail</Button>
    </form>
  </section>;
}
