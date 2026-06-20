import { Check, Circle, MoveRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupChecklist() {
  return (
    <Card className="max-w-2xl">
      <CardHeader><CardTitle>Finish setting up Ranch Ledger</CardTitle><CardDescription>Your account is ready. Add the ranch to establish its secure workspace and your administrator access.</CardDescription></CardHeader>
      <CardContent>
        <ol className="space-y-4">
          <li className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span><span className="font-medium">Administrator account created</span></li>
          <li className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full border"><Circle className="size-3" /></span><span>Enter ranch details</span></li>
          <li className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full border"><Circle className="size-3" /></span><span>Create Ranch Administrator membership</span></li>
        </ol>
        <Button asChild size="lg" className="mt-7 h-11"><Link href="/onboarding">Continue setup <MoveRight /></Link></Button>
      </CardContent>
    </Card>
  );
}
