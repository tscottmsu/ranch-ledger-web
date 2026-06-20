import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/authentication/services/auth-actions";
import { getCurrentUser } from "@/features/authentication/services/auth-service";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Brand />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <form action={logoutAction}><Button type="submit" variant="ghost" size="sm"><LogOut /> Sign out</Button></form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
