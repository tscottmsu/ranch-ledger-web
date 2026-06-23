"use client";

import { useMemo, useState } from "react";
import { Archive, CalendarDays, Pencil, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { archiveReservationAction } from "../services/reservation-actions";
import type { ReservationWithGuests } from "../types";

const formatDate = (date: string | null) => date ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)) : "Not set";
function archiveMessage(name: string) { return `${name} will be hidden from daily operations but kept for history. Archive this reservation?`; }

export function ReservationList({ reservations }: { reservations: ReservationWithGuests[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => reservations.filter((reservation) => [reservation.reservation_name, reservation.primary_contact_name, reservation.primary_contact_email, reservation.primary_contact_phone, reservation.status, reservation.arrival_date, reservation.departure_date, ...reservation.guests.map((guest) => `${guest.first_name} ${guest.last_name}`)].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase())), [reservations, query]);
  if (!reservations.length) return <EmptyState icon={CalendarDays} title="No reservations yet" description="Create a reservation to organize families, parties, retreats, or other guest groups." href="/dashboard/reservations/new" action="Add reservation" />;
  return <div className="space-y-4"><label className="flex h-10 max-w-md items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reservations" className="h-full flex-1 bg-transparent text-foreground outline-none" /></label><div className="grid gap-4 md:grid-cols-2">{filtered.map((reservation) => {
    const name = reservation.reservation_name || reservation.primary_contact_name || "Unnamed reservation";
    return <div key={reservation.id} className={`rounded-2xl border bg-card p-5 shadow-sm ${reservation.status === "archived" ? "opacity-70" : ""}`}><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{name}</h2><p className="mt-1 text-sm text-muted-foreground">{reservation.primary_contact_name || "No primary contact"}</p>{reservation.guests.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{reservation.guests.map((guest) => `${guest.first_name} ${guest.last_name}`).join(", ")}</p>}</div><Badge className={reservation.status === "archived" ? "" : "bg-primary/10 text-primary"}>{reservation.status.replace("_", " ")}</Badge></div><div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" />{formatDate(reservation.arrival_date)} - {formatDate(reservation.departure_date)}</div><div className="mt-5 flex justify-end gap-1 border-t pt-3"><Button asChild variant="ghost" size="sm"><Link href={`/dashboard/reservations/${reservation.id}/edit`}><Pencil />Edit</Link></Button>{reservation.status !== "archived" && <form action={archiveReservationAction.bind(null, reservation.id)} onSubmit={(event) => { if (!window.confirm(archiveMessage(name))) event.preventDefault(); }}><Button variant="ghost" size="sm"><Archive />Archive</Button></form>}</div></div>;
  })}{!filtered.length && <div className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground md:col-span-2">No reservations match that search.</div>}</div></div>;
}
