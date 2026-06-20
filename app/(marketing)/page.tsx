import { ArrowRight, ClipboardCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
      <section>
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Built for working ranches</p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
          Run the ranch with a clearer view of the day.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
          Ranch Ledger brings administration and daily operations into one dependable, ranch-scoped workspace.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-11 px-5">
            <Link href="/onboarding">Set up your ranch <ArrowRight /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-5">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>
      <aside className="rounded-3xl border bg-card/90 p-6 shadow-xl shadow-primary/10 backdrop-blur sm:p-8">
        <div className="rounded-2xl bg-sidebar p-6 text-sidebar-foreground">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Ranch administration</p>
          <p className="mt-2 text-2xl font-semibold">A sound foundation first.</p>
        </div>
        <div className="mt-5 grid gap-3">
          <div className="flex gap-4 rounded-2xl border p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div><p className="font-medium">Secure by design</p><p className="mt-1 text-sm text-muted-foreground">Ranch-scoped access and protected workspaces.</p></div>
          </div>
          <div className="flex gap-4 rounded-2xl border p-4">
            <ClipboardCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div><p className="font-medium">Ready to grow</p><p className="mt-1 text-sm text-muted-foreground">A clean base for the operational tools ahead.</p></div>
          </div>
        </div>
      </aside>
    </main>
  );
}
