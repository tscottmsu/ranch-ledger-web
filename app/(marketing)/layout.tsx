import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/features/authentication/services/auth-service";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getCurrentUser();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 sm:py-10 lg:px-8">
        <Brand prominent href={user ? "/dashboard" : "/"} />
      </header>
      {children}
    </div>
  );
}
