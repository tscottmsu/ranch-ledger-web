import { Activity, Building2, CalendarRange, Check, Circle, Mountain, PawPrint, UserRound, Users } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ranch } from "@/features/ranch/types";
import type { GuestSummary, SetupProgress } from "../types";

export function WelcomePanel({ ranch, progress, guestSummary }: { ranch: Ranch; progress: SetupProgress; guestSummary: GuestSummary }) {
  const items = [
    { label: "Employees", count: progress.employees, href: "/dashboard/employees", icon: Users },
    { label: "Horses", count: progress.horses, href: "/dashboard/horses", icon: PawPrint },
    { label: "Trails", count: progress.trails, href: "/dashboard/trails", icon: Mountain },
    { label: "Activity Types", count: progress.activityTypes, href: "/dashboard/activity-types", icon: Activity },
  ];
  const percent = Math.round((progress.completed / progress.total) * 100);
  const metrics = [
    { label: "Guest records", value: guestSummary.guests, detail: `${guestSummary.checkedIn} checked in`, href: "/dashboard/guests", icon: UserRound },
    { label: "Reservations", value: guestSummary.reservations, detail: "Active groups", href: "/dashboard/reservations", icon: CalendarRange },
  ];
  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2">{metrics.map(({ label, value, detail, href, icon: Icon }) => <Link href={href} key={label} className="group rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="text-3xl font-semibold tracking-tight">{value}</span></div><p className="mt-4 font-semibold">{label}</p><p className="mt-1 text-sm text-muted-foreground">{detail}</p></Link>)}</div>
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <Card><CardHeader><div className="flex items-start justify-between gap-4"><div><div className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 /></div><CardTitle className="text-2xl">Ranch setup</CardTitle><CardDescription>Add the foundation your team will need before daily operations begin.</CardDescription></div><span className="text-2xl font-semibold text-primary">{percent}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div></CardHeader><CardContent><ul className="grid gap-3 sm:grid-cols-2">{items.map(({ label, count, href, icon: Icon }) => <li key={label}><Link href={href} className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/40"><span className={`grid size-8 place-items-center rounded-full ${count ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{count ? <Check className="size-4" /> : <Circle className="size-4" />}</span><Icon className="size-4 text-muted-foreground" /><span className="font-medium">{label}</span><span className="ml-auto text-sm text-muted-foreground">{count}</span></Link></li>)}</ul></CardContent></Card>
      <Card><CardHeader><CardTitle>{ranch.name}</CardTitle><CardDescription>Ranch workspace</CardDescription></CardHeader><CardContent className="space-y-4 text-sm"><div><p className="text-muted-foreground">Setup complete</p><p className="mt-1 font-medium">{progress.completed} of {progress.total} areas</p></div><div><p className="text-muted-foreground">Timezone</p><p className="mt-1 font-medium">{ranch.timezone}</p></div>{ranch.email && <div><p className="text-muted-foreground">Email</p><p className="mt-1 font-medium">{ranch.email}</p></div>}</CardContent></Card>
    </div>
  </div>;
}
