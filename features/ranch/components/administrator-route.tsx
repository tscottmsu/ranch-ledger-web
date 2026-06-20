import { redirect } from "next/navigation";

import { getCurrentRanchContext } from "../services/ranch-context-service";

export async function AdministratorRoute({ children }: { children: React.ReactNode }) {
  const context = await getCurrentRanchContext();
  if (!context) redirect("/onboarding");
  if (context.role !== "ranch_administrator") redirect("/dashboard");
  return children;
}
