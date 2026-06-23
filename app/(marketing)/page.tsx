import { ArrowRight, CalendarClock, CircleCheck, Sunrise, UsersRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  const metrics = [
    { label: "Guests arriving", value: "12" },
    { label: "Checked in", value: "7" },
    { label: "Activities", value: "4" },
    { label: "Ready", value: "3" },
  ];
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-20 lg:px-8 lg:pb-28">
    <section className="mx-auto max-w-5xl py-12 text-center sm:py-16 lg:py-20">
      <p className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm"><Sunrise className="size-4" />Built for the ranch morning</p>
      <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">Know what the day needs before the first ride leaves.</h1>
      <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">Ranch Ledger brings guests, resources, and today’s activities into one calm operational view—so your team can spend less time piecing the day together.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3"><Button asChild size="lg" className="h-11 px-5"><Link href="/onboarding">Set up your ranch <ArrowRight /></Link></Button><Button asChild variant="outline" size="lg" className="h-11 px-5"><Link href="/login">Sign in</Link></Button></div>
    </section>

    <section className="overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/10">
      <div className="flex flex-col justify-between gap-4 bg-sidebar px-6 py-5 text-sidebar-foreground sm:flex-row sm:items-center sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Today’s Operations</p><h2 className="mt-1 text-xl font-semibold">A clear view of the ranch day</h2></div><p className="text-sm text-sidebar-foreground/60">Tuesday · Daily briefing</p></div>
      <div className="grid gap-px bg-border sm:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="bg-card p-6"><p className="text-sm text-muted-foreground">{metric.label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</p></div>)}</div>
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.42fr]">
        <div><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Morning schedule</h3><span className="text-xs text-muted-foreground">2 of 4 shown</span></div><div className="space-y-3"><div className="flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><CalendarClock className="size-5" /></span><div><p className="font-semibold">Morning Trail Ride</p><p className="mt-1 text-sm text-muted-foreground">8:00 AM · Capacity 12</p></div></div><span className="w-fit rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-800">Draft · needs attention</span></div><div className="flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid size-10 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700"><CircleCheck className="size-5" /></span><div><p className="font-semibold">Guided Ridge Hike</p><p className="mt-1 text-sm text-muted-foreground">10:30 AM · Capacity 8</p></div></div><span className="w-fit rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700">Ready</span></div></div></div>
        <aside className="rounded-2xl bg-muted/45 p-5"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><UsersRound className="size-5" /></span><h3 className="mt-4 font-semibold">People and parties</h3><dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between border-b pb-3"><dt className="text-muted-foreground">Reservations arriving</dt><dd className="font-semibold">3</dd></div><div className="flex justify-between border-b pb-3"><dt className="text-muted-foreground">Guests checked in</dt><dd className="font-semibold">7</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Needs attention</dt><dd className="font-semibold text-primary">1 activity</dd></div></dl></aside>
      </div>
    </section>
  </main>;
}
