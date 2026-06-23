"use client";

import { useMemo, useState } from "react";
import { Archive, Pencil, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { archiveGuestAction } from "../services/guest-actions";
import type { GuestWithPrep } from "../types";

function archiveMessage(name: string) {
  return `${name} will be hidden from daily operations and ride rosters, but kept for history. Archive this guest?`;
}

export function GuestList({ guests }: { guests: GuestWithPrep[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => guests.filter((guest) => [guest.first_name, guest.last_name, guest.nickname, guest.phone, guest.reservation?.reservation_name, guest.reservation?.primary_contact_name, guest.status].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase())), [guests, query]);
  if (!guests.length) return <EmptyState icon={UserRound} title="No guests yet" description="Add individual guest records, with or without a reservation." href="/dashboard/guests/new" action="Add guest" />;
  return <div className="space-y-4"><label className="flex h-10 max-w-md items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guests" className="h-full flex-1 bg-transparent text-foreground outline-none" /></label><div className="overflow-hidden rounded-2xl border bg-card"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3">Guest</th><th className="px-5 py-3">Reservation</th><th className="px-5 py-3">Fit info</th><th className="px-5 py-3">Horse</th><th className="px-5 py-3">Saddle</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y">{filtered.map((guest) => {
    const name = `${guest.first_name} ${guest.last_name}`;
    const fitComplete = Boolean(guest.height_inches && guest.weight_lbs);
    return <tr key={guest.id} className="hover:bg-muted/20"><td className="px-5 py-4 font-medium">{name}{guest.nickname && <span className="block text-xs font-normal text-muted-foreground">&quot;{guest.nickname}&quot;</span>}</td><td className="px-5 py-4 text-muted-foreground">{guest.reservation?.reservation_name || guest.reservation?.primary_contact_name || "Not assigned"}</td><td className="px-5 py-4"><Badge className={fitComplete ? "bg-primary/10 text-primary" : "bg-orange-100 text-orange-800"}>{fitComplete ? "Fit info complete" : "Needs prep"}</Badge></td><td className="px-5 py-4 text-muted-foreground">{guest.riding_assignment?.horse?.name ?? "Needs prep"}</td><td className="px-5 py-4 text-muted-foreground">{guest.riding_assignment?.saddle?.name ?? "Needs prep"}</td><td className="px-5 py-4"><Badge className="bg-primary/10 text-primary">{guest.status.replaceAll("_", " ")}</Badge></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Button asChild variant="ghost" size="icon" aria-label="Edit guest"><Link href={`/dashboard/guests/${guest.id}/edit`}><Pencil /></Link></Button><form action={archiveGuestAction.bind(null, guest.id)} onSubmit={(event) => { if (!window.confirm(archiveMessage(name))) event.preventDefault(); }}><Button variant="ghost" size="icon" aria-label="Archive guest"><Archive /></Button></form></div></td></tr>;
  })}{!filtered.length && <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No guests match that search.</td></tr>}</tbody></table></div></div></div>;
}
