import { Archive, Armchair, Pencil } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { archiveSaddleAction } from "../data/saddle-actions";
import type { Saddle } from "../types";

function fitRange(min: number | null, max: number | null, suffix: string) {
  if (min && max) return `${min}-${max} ${suffix}`;
  if (min) return `${min}+ ${suffix}`;
  if (max) return `Up to ${max} ${suffix}`;
  return "Manual fit";
}

export function SaddleList({ saddles }: { saddles: Saddle[] }) {
  if (!saddles.length) return <EmptyState icon={Armchair} title="No saddles yet" description="Set up tack so Ranch Ledger can recommend saddle fit during guest prep." href="/dashboard/saddles/new" action="Add saddle" />;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{saddles.map((saddle) => <div key={saddle.id} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{saddle.name}</h2><p className="mt-1 text-sm text-muted-foreground">{saddle.saddle_number ? `Saddle number ${saddle.saddle_number}` : "No saddle number"}</p></div><Badge className={saddle.status === "active" ? "bg-primary/10 text-primary" : ""}>{saddle.status}</Badge></div><dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-muted-foreground">Seat size</dt><dd className="mt-1 font-medium">{saddle.seat_size || "Not set"}</dd></div><div><dt className="text-muted-foreground">Type</dt><dd className="mt-1 font-medium">{saddle.type || "Trail"}</dd></div><div><dt className="text-muted-foreground">Best fit height</dt><dd className="mt-1 font-medium">{fitRange(saddle.rider_height_min, saddle.rider_height_max, "in")}</dd></div><div><dt className="text-muted-foreground">Best fit weight</dt><dd className="mt-1 font-medium">{fitRange(saddle.rider_weight_min, saddle.rider_weight_max, "lbs")}</dd></div></dl><div className="mt-5 flex justify-end gap-1 border-t pt-3"><Button asChild variant="ghost" size="sm"><Link href={`/dashboard/saddles/${saddle.id}/edit`}><Pencil />Edit</Link></Button>{saddle.status === "active" && <form action={archiveSaddleAction.bind(null, saddle.id)}><Button variant="ghost" size="sm"><Archive />Archive</Button></form>}</div></div>)}</div>;
}
