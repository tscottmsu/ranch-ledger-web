import { CalendarX, UsersRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { OperationsSnapshot } from "../types";
import { OperationsActivityCard } from "./operations-activity-card";
import { OperationsSummary } from "./operations-summary";

const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function OperationsBoard({ snapshot }: { snapshot: OperationsSnapshot }) {
  return <>
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Daily Operations</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Today at the ranch</h1><p className="mt-2 text-sm text-muted-foreground">{formatDate(snapshot.date)} · {snapshot.timezone.replaceAll("_", " ")}</p></div><Button asChild><Link href="/dashboard/activities/new">Schedule activity</Link></Button></div>
    <OperationsSummary snapshot={snapshot} />
    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_20rem]">
      <section><div className="mb-4"><h2 className="text-xl font-semibold">Today’s activities</h2><p className="mt-1 text-sm text-muted-foreground">Assignments are intentionally deferred to Sprint 5.</p></div>{snapshot.activities.length ? <div className="grid gap-4 lg:grid-cols-2">{snapshot.activities.map((activity) => <OperationsActivityCard key={activity.id} activity={activity} />)}</div> : <div className="rounded-2xl border border-dashed bg-card p-12 text-center"><CalendarX className="mx-auto size-9 text-muted-foreground" /><h3 className="mt-4 font-semibold">No activities scheduled today</h3><p className="mt-2 text-sm text-muted-foreground">The operations board is clear for the day.</p></div>}</section>
      <aside className="h-fit rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><UsersRound className="size-5" /></span><div><h2 className="font-semibold">Arriving today</h2><p className="text-xs text-muted-foreground">{snapshot.arrivals.length} reservations</p></div></div>{snapshot.arrivals.length ? <ul className="mt-4 divide-y">{snapshot.arrivals.map((reservation) => <li key={reservation.id} className="py-3"><p className="text-sm font-medium">{reservation.reservation_name || reservation.primary_contact_name || "Unnamed reservation"}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{reservation.status.replaceAll("_", " ")}</p></li>)}</ul> : <p className="mt-4 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">No reservation arrivals today.</p>}</aside>
    </div>
  </>;
}
