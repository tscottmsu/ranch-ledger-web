import { Brand } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.8fr_1.2fr]">
      <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand className="text-primary-foreground" />
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-70">Ranch Ledger</p>
          <p className="mt-4 text-4xl font-semibold leading-tight tracking-tight">Good operations begin with a trustworthy foundation.</p>
        </div>
        <p className="text-sm opacity-70">Secure, ranch-scoped, and ready for the day ahead.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <Brand className="mb-10 lg:hidden" />
          {children}
        </div>
      </section>
    </main>
  );
}
