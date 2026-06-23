import { Archive, CalendarClock, MapPin, Pencil } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { cn } from "@/lib/utils";
import { archiveActivityAction } from "../services/activity-actions";
import type { ActivityStatus, ActivityWithRelations } from "../types";

const statusStyles: Record<ActivityStatus, string> = { draft: "bg-amber-500/10 text-amber-800", ready: "bg-emerald-600/10 text-emerald-700", in_progress: "bg-primary/10 text-primary", completed: "bg-emerald-600/10 text-emerald-700", cancelled: "bg-destructive/10 text-destructive" };
const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const formatTime = (time: string | null) => time ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(`2000-01-01T${time}Z`)) : "Time not set";

export function ActivityList({ activities }: { activities: ActivityWithRelations[] }) {
  if (!activities.length) return <EmptyState icon={CalendarClock} title="No activities scheduled" description="Schedule the ranch events that will appear in daily operations." href="/dashboard/activities/new" action="Schedule activity" />;
  return <div className="grid gap-4 lg:grid-cols-2">{activities.map((activity) => { const archived = Boolean(activity.archived_at); return <article key={activity.id} className={cn("rounded-2xl border bg-card p-5 shadow-sm", archived && "opacity-65")}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-primary">{activity.activity_type?.name ?? "Activity"}</p><h2 className="mt-1 text-lg font-semibold">{activity.name || activity.activity_type?.name || "Scheduled activity"}</h2></div><Badge className={archived ? "" : statusStyles[activity.status]}>{archived ? "archived" : activity.status.replace("_", " ")}</Badge></div><div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2"><div><p className="font-medium text-foreground">{formatDate(activity.activity_date)}</p><p className="mt-1">{formatTime(activity.start_time)}{activity.end_time ? ` – ${formatTime(activity.end_time)}` : ""}</p></div><div>{activity.trail && <p className="flex items-center gap-1.5"><MapPin className="size-4" />{activity.trail.name}</p>}<p className="mt-1">Capacity: {activity.capacity ?? "Not set"}</p></div></div>{!archived && <div className="mt-5 flex justify-end gap-1 border-t pt-3"><Button asChild variant="ghost" size="sm"><Link href={`/dashboard/activities/${activity.id}/edit`}><Pencil />Edit</Link></Button><form action={archiveActivityAction.bind(null, activity.id)}><Button variant="ghost" size="sm"><Archive />Archive</Button></form></div>}</article>; })}</div>;
}
