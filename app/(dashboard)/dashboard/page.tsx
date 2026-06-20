import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SetupChecklist } from "@/features/dashboard/components/setup-checklist";
import { WelcomePanel } from "@/features/dashboard/components/welcome-panel";
import { getDashboardContext } from "@/features/dashboard/services/dashboard-service";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const context = await getDashboardContext();
  if (!context) redirect("/login");
  const firstName = String(context.user.user_metadata.first_name ?? "there");

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <p className="text-sm font-semibold text-primary">Ranch Administrator</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Good to see you, {firstName}.</h1>
      <p className="mt-2 mb-8 text-muted-foreground">{context.ranch ? "Your ranch workspace is ready." : "Let’s finish the foundation for your ranch."}</p>
      {context.ranch ? <WelcomePanel ranch={context.ranch} /> : <SetupChecklist />}
    </main>
  );
}
