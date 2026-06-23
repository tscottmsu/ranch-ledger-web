import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createRideAction } from "../data/ride-actions";
import type { RideTrailOption } from "../types";

export function CreateRideDialog({ date, trails }: { date: string; trails: RideTrailOption[] }) {
  return <details className="group rounded-lg border border-orange-200 bg-white shadow-sm open:shadow-md">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-stone-900 marker:hidden">
      <span className="flex items-center gap-2"><Plus className="size-4 text-orange-700" />Build today&apos;s morning ride</span>
      <span className="text-xs text-stone-500 group-open:hidden">Open</span>
    </summary>
    <form action={createRideAction} className="grid gap-3 border-t border-orange-100 p-4">
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="status" value="draft" />
      <label className="grid gap-1 text-sm font-medium text-stone-700">Ride name
        <input name="name" defaultValue="Morning Ride" className="h-9 rounded-lg border bg-white px-3 text-sm" />
      </label>
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-stone-700">Trail
          <select name="trail" className="h-9 rounded-lg border bg-white px-3 text-sm">
            <option value="">Choose later</option>
            {trails.map((trail) => <option key={trail.id} value={trail.id}>{trail.name}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-sm font-medium text-stone-700">Start
          <input name="startTime" type="time" defaultValue="09:00" className="h-9 rounded-lg border bg-white px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-stone-700">End
          <input name="endTime" type="time" defaultValue="11:00" className="h-9 rounded-lg border bg-white px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-stone-700">Capacity
          <input name="capacity" type="number" min={1} step={1} defaultValue={8} className="h-9 rounded-lg border bg-white px-3 text-sm" />
        </label>
      </div>
      <Button type="submit" className="bg-orange-700 text-white hover:bg-orange-800">Create ride</Button>
    </form>
  </details>;
}
