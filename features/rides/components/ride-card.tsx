import { AlertTriangle, ArrowRight, Clock3, MapPin, UsersRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { RideWithAssignments } from "../types";
import { RideStatusBadge } from "./ride-status-badge";

const formatTime = (time: string | null) => time ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(`2000-01-01T${time}Z`)) : "Time not set";

export function RideCard({ ride }: { ride: RideWithAssignments }) {
  const lead = ride.wrangler_assignments.find((assignment) => assignment.role === "lead") ?? ride.wrangler_assignments[0];
  const blocking = ride.validation_warnings.filter((warning) => warning.severity === "blocking").length;
  return <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">{ride.activity_type?.name ?? "Ride"}</p>
        <h3 className="mt-1 text-xl font-semibold text-stone-950">{ride.name}</h3>
      </div>
      <RideStatusBadge status={ride.status} />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-stone-50 p-4 text-sm">
      <p className="flex items-center gap-2 text-stone-700"><Clock3 className="size-4 text-orange-700" />{formatTime(ride.start_time)}</p>
      <p className="flex items-center gap-2 text-stone-700"><UsersRound className="size-4 text-orange-700" />{ride.guests.length} guests</p>
      <p className="flex items-center gap-2 text-stone-700"><MapPin className="size-4 text-orange-700" />{ride.trail?.name ?? "Trail needed"}</p>
      <p className="truncate text-stone-700">{lead?.employee ? `${lead.employee.first_name} ${lead.employee.last_name}` : "Wrangler needed"}</p>
    </div>
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className={blocking ? "flex items-center gap-1.5 text-sm font-medium text-red-700" : "text-sm text-stone-500"}>
        {blocking ? <AlertTriangle className="size-4" /> : null}{blocking ? `${blocking} blocking warning${blocking === 1 ? "" : "s"}` : `${ride.validation_warnings.length} warnings`}
      </p>
      <Button asChild size="sm" className="bg-stone-950 text-white hover:bg-stone-800"><Link href={`/dashboard/rides/${ride.id}`}>Open builder <ArrowRight /></Link></Button>
    </div>
  </article>;
}
