import { CalendarDays, CircleAlert, CircleCheck, UserCheck } from "lucide-react";
import type { OperationsSnapshot } from "../types";

export function OperationsSummary({ snapshot }: { snapshot: OperationsSnapshot }) {
  const metrics = [
    { label: "Activities", value: snapshot.counts.total, detail: `${snapshot.counts.inProgress} in progress`, icon: CalendarDays, tone: "text-primary bg-primary/10" },
    { label: "Ready", value: snapshot.counts.ready, detail: "Prepared to begin", icon: CircleCheck, tone: "text-emerald-700 bg-emerald-600/10" },
    { label: "Needs attention", value: snapshot.counts.drafts, detail: "Activities still in draft", icon: CircleAlert, tone: "text-amber-800 bg-amber-500/10" },
    { label: "Guests checked in", value: snapshot.checkedInGuests, detail: `${snapshot.readyGuests} ready for assignment`, icon: UserCheck, tone: "text-foreground bg-muted" },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, detail, icon: Icon, tone }) => <div key={label} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></span><span className="text-3xl font-semibold tracking-tight">{value}</span></div><p className="mt-4 font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}</div>;
}
