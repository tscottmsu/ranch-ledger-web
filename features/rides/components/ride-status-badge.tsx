import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RideStatus } from "../types";

const styles: Record<RideStatus, string> = {
  draft: "bg-stone-200 text-stone-800",
  assigning: "bg-orange-100 text-orange-800",
  ready: "bg-emerald-100 text-emerald-800",
  active: "bg-sky-100 text-sky-800",
  completed: "bg-stone-100 text-stone-700",
  cancelled: "bg-red-100 text-red-800",
};

export function RideStatusBadge({ status, className }: { status: RideStatus; className?: string }) {
  return <Badge className={cn("capitalize", styles[status], className)}>{status.replace("_", " ")}</Badge>;
}
