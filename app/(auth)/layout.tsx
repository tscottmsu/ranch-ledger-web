import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/features/authentication/services/auth-service";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getCurrentUser();
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.8fr_1.2fr]">
      <section className="hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand href={user ? "/dashboard" : "/"} className="text-sidebar-foreground" />
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-70">Ranch Ledger</p>
          <p className="mt-4 text-4xl font-semibold leading-tight tracking-tight">Good operations begin with a trustworthy foundation.</p>
        </div>
        <p className="text-sm opacity-70">Secure, ranch-scoped, and ready for the day ahead.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <Brand href={user ? "/dashboard" : "/"} className="mb-10 lg:hidden" />
          {children}
        </div>
      </section>
    </main>
  );
}
