import { redirect } from "next/navigation";

import { getCurrentRanchContext } from "../services/ranch-context-service";

export async function OperationsRoute({ children }: { children: React.ReactNode }) {
  const context = await getCurrentRanchContext();
  if (!context) redirect("/onboarding");
  if (!["ranch_administrator", "head_wrangler"].includes(context.role)) redirect("/dashboard");
  return children;
}
