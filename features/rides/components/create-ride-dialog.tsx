import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createRideAction } from "../data/ride-actions";
import type { RideOption, RideTrailOption } from "../types";

function findHorsebackRideType(activityTypes: RideOption[]) {
  return activityTypes.find((type) => /\b(horse|horseback|riding|ride|trail ride)\b/i.test(type.name));
}

export function CreateRideDialog({ date, activityTypes, trails }: { date: string; activityTypes: RideOption[]; trails: RideTrailOption[] }) {
  const horsebackRideType = findHorsebackRideType(activityTypes);
  return <details className="group rounded-lg border border-orange-200 bg-white shadow-sm open:shadow-md">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-stone-900 marker:hidden">
      <span className="flex items-center gap-2"><Plus className="size-4 text-orange-700" />Build today&apos;s morning ride</span>
      <span className="text-xs text-stone-500 group-open:hidden">Open</span>
    </summary>
    <form action={createRideAction} className="grid gap-3 border-t border-orange-100 p-4">
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="status" value="draft" />
      {horsebackRideType && <input type="hidden" name="activityType" value={horsebackRideType.id} />}
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
      <Button type="submit" disabled={!horsebackRideType} className="bg-orange-700 text-white hover:bg-orange-800">Create ride</Button>
      {!horsebackRideType && <p className="rounded-lg bg-orange-50 p-3 text-sm text-orange-900">Create an active horseback ride setup item before building today&apos;s rides.</p>}
    </form>
  </details>;
}
