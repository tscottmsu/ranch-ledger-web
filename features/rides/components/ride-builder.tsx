import { Check, Flag, Play, RotateCw, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { regenerateRideWarningsAction, updateRideStatusAction } from "../data/ride-actions";
import type { AvailableHorse, AvailableWrangler, EligibleRideGuest, RideTrailOption, RideWithAssignments, Saddle } from "../types";
import { EligibleGuestList } from "./eligible-guest-list";
import { HorseAssignmentPanel } from "./horse-assignment-panel";
import { RideStatusBadge } from "./ride-status-badge";
import { RideWarningList } from "./ride-warning-list";
import { TrailAssignmentPanel } from "./trail-assignment-panel";
import { WranglerAssignmentPanel } from "./wrangler-assignment-panel";

const formatTime = (time: string | null) => time ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(`2000-01-01T${time}Z`)) : "Time not set";

export function RideBuilder({ ride, trails, eligibleGuests, availableHorses, availableWranglers, saddles }: { ride: RideWithAssignments; trails: RideTrailOption[]; eligibleGuests: EligibleRideGuest[]; availableHorses: AvailableHorse[]; availableWranglers: AvailableWrangler[]; saddles: Saddle[] }) {
  const blockingWarnings = ride.validation_warnings.filter((warning) => warning.severity === "blocking");
  const canMarkReady = !blockingWarnings.length;
  const statusActions = [
    ride.status === "draft" || ride.status === "assigning" ? { status: "ready" as const, label: "Mark ready", icon: Check, disabled: !canMarkReady } : null,
    ride.status === "ready" ? { status: "active" as const, label: "Start ride", icon: Play, disabled: false } : null,
    ride.status === "active" ? { status: "completed" as const, label: "Complete ride", icon: Flag, disabled: false } : null,
    ride.status !== "completed" && ride.status !== "cancelled" ? { status: "cancelled" as const, label: "Cancel ride", icon: XCircle, disabled: false } : null,
  ].filter(Boolean);

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 rounded-lg bg-stone-950 px-5 py-6 text-white shadow-sm sm:px-7 lg:flex-row lg:items-end">
      <div>
        <Link href="/dashboard/operations" className="text-sm font-medium text-orange-300 hover:text-orange-200">Back to Ride Operations</Link>
        <div className="mt-3 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-semibold tracking-tight">{ride.name}</h1><RideStatusBadge status={ride.status} /></div>
        <p className="mt-2 text-sm text-stone-300">{formatTime(ride.start_time)} - {ride.trail?.name ?? "Trail not assigned"} - {ride.guests.length} guests</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <form action={regenerateRideWarningsAction.bind(null, ride.id)}><Button type="submit" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20"><RotateCw />Refresh warnings</Button></form>
        {statusActions.map((action) => {
          if (!action) return null;
          const Icon = action.icon;
          return <form key={action.status} action={updateRideStatusAction.bind(null, ride.id, action.status)}><Button type="submit" disabled={action.disabled} className={action.status === "cancelled" ? "bg-red-700 text-white hover:bg-red-800" : "bg-orange-700 text-white hover:bg-orange-800"}><Icon />{action.label}</Button></form>;
        })}
      </div>
    </div>
    {blockingWarnings.length ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">Resolve blocking warnings before marking this ride ready.</p> : null}
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        <WranglerAssignmentPanel ride={ride} wranglers={availableWranglers} />
        <TrailAssignmentPanel ride={ride} trails={trails} />
        <EligibleGuestList ride={ride} guests={eligibleGuests} />
        <HorseAssignmentPanel ride={ride} horses={availableHorses} saddles={saddles} />
      </div>
      <aside className="h-fit rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Ride readiness</h2>
        <p className="mt-1 text-sm text-stone-500">Warnings explain what must be fixed before this ride can leave the yard.</p>
        <div className="mt-4"><RideWarningList warnings={ride.validation_warnings} /></div>
      </aside>
    </div>
  </div>;
}
