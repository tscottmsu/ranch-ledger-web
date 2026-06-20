import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardContext } from "@/features/dashboard/services/dashboard-service";
import { PageHeader } from "@/features/dashboard/components/page-header";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const context = await getDashboardContext();
  if (!context?.ranch) redirect("/onboarding");
  return <><PageHeader title="Settings" description="Review the ranch workspace configured during onboarding." /><Card className="max-w-2xl"><CardHeader><CardTitle>{context.ranch.name}</CardTitle><CardDescription>Ranch profile editing will expand in a later administration sprint.</CardDescription></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p><p className="mt-1 text-sm">{context.ranch.email || "Not provided"}</p></div><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</p><p className="mt-1 text-sm">{context.ranch.phone || "Not provided"}</p></div><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Timezone</p><p className="mt-1 text-sm">{context.ranch.timezone}</p></div><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Address</p><p className="mt-1 text-sm">{context.ranch.address_line_1 || "Not provided"}</p></div></CardContent></Card></>;
}
