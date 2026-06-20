import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, description, href, action }: { icon: LucideIcon; title: string; description: string; href: string; action: string }) {
  return <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon /></span><h2 className="mt-4 font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p><Button asChild className="mt-5"><Link href={href}>{action}</Link></Button></div>;
}
