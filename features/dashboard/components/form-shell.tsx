import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function FormShell({ title, description, backHref, children }: { title: string; description: string; backHref: string; children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl"><Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</Link><div className="rounded-2xl border bg-card shadow-sm"><div className="border-b p-6"><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>{children}</div></div>;
}
