import { Fence } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Fence className="size-5" aria-hidden="true" />
      </span>
      <span>Ranch Ledger</span>
    </Link>
  );
}
