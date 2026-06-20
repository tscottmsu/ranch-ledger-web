import { Building2, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ranch } from "@/features/ranch/types";

export function WelcomePanel({ ranch }: { ranch: Ranch }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <Card>
        <CardHeader><div className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 /></div><CardTitle className="text-2xl">Welcome to {ranch.name}</CardTitle><CardDescription>Your Ranch Ledger foundation is ready. Operational modules will be added in future sprints.</CardDescription></CardHeader>
        <CardContent><div className="flex items-center gap-2 rounded-xl border bg-muted/40 p-4 text-sm"><CheckCircle2 className="size-5 text-primary" /><span>Ranch Administrator access is active.</span></div></CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Ranch profile</CardTitle><CardDescription>Core workspace details</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><div><p className="text-muted-foreground">Timezone</p><p className="mt-1 font-medium">{ranch.timezone}</p></div>{ranch.email && <div><p className="text-muted-foreground">Email</p><p className="mt-1 font-medium">{ranch.email}</p></div>}{ranch.phone && <div><p className="text-muted-foreground">Phone</p><p className="mt-1 font-medium">{ranch.phone}</p></div>}</CardContent></Card>
    </div>
  );
}
