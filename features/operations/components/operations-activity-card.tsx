import { ArrowRight, Check, Clock3, MapPin, Play, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateActivityStatusAction } from "@/features/activities/services/activity-actions";
import type { ActivityStatus, ActivityWithRelations } from "@/features/activities/types";

const statusStyles: Record<ActivityStatus, string> = { draft: "bg-amber-500/10 text-amber-800", ready: "bg-emerald-600/10 text-emerald-700", in_progress: "bg-primary/10 text-primary", completed: "bg-emerald-600/10 text-emerald-700", cancelled: "bg-destructive/10 text-destructive" };
const formatTime = (time: string | null) => time ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(`2000-01-01T${time}Z`)) : "Time not set";

export function OperationsActivityCard({ activity }: { activity: ActivityWithRelations }) {
  const next = activity.status === "draft" ? { status: "ready" as const, label: "Mark ready", icon: Check } : activity.status === "ready" ? { status: "in_progress" as const, label: "Start activity", icon: Play } : activity.status === "in_progress" ? { status: "completed" as const, label: "Complete", icon: Check } : null;
  const NextIcon = next?.icon;
  return <article className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-primary">{activity.activity_type?.name ?? "Activity"}</p><h3 className="mt-1 text-xl font-semibold">{activity.name || activity.activity_type?.name || "Scheduled activity"}</h3></div><Badge className={statusStyles[activity.status]}>{activity.status.replace("_", " ")}</Badge></div><div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-muted/35 p-4 text-sm"><div><p className="text-xs text-muted-foreground">Schedule</p><p className="mt-1 flex items-center gap-1.5 font-medium"><Clock3 className="size-4" />{formatTime(activity.start_time)}</p></div><div><p className="text-xs text-muted-foreground">Guests</p><p className="mt-1 flex items-center gap-1.5 font-medium"><Users className="size-4" />0 / {activity.capacity ?? "—"}</p></div><div><p className="text-xs text-muted-foreground">Assignments</p><p className="mt-1 font-medium">{activity.status === "draft" ? "Not started" : "Pending"}</p></div><div><p className="text-xs text-muted-foreground">Trail</p><p className="mt-1 flex items-center gap-1.5 font-medium"><MapPin className="size-4" />{activity.trail?.name ?? "Not set"}</p></div></div><div className="mt-4 flex flex-wrap justify-end gap-2">{next && NextIcon && <form action={updateActivityStatusAction.bind(null, activity.id, next.status)}><Button type="submit" size="sm"><NextIcon />{next.label}</Button></form>}<Button asChild variant="outline" size="sm"><Link href={`/dashboard/activities/${activity.id}/edit`}>Details <ArrowRight /></Link></Button></div></article>;
}
