import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/authentication/services/auth-service";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { getCurrentRanchContext } from "@/features/ranch/services/ranch-context-service";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login");
  const ranch = await getCurrentRanchContext();

  return <DashboardShell ranchName={ranch?.ranchName} role={ranch?.role} email={user.email}>{children}</DashboardShell>;
}
