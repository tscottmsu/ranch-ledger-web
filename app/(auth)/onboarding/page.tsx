import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/authentication/services/auth-service";
import { SignUpForm } from "@/features/authentication/components/sign-up-form";
import { getRanchForUser } from "@/features/ranch/services/ranch-service";
import { OnboardingSteps } from "@/features/ranch/components/onboarding-steps";
import { RanchForm } from "@/features/ranch/components/ranch-form";

export const metadata: Metadata = { title: "Set up your ranch" };

export default async function OnboardingPage() {
  const { user } = await getCurrentUser();
  if (user) {
    const ranch = await getRanchForUser(user.id);
    if (ranch) redirect("/dashboard");
  }

  return (
    <div>
      <OnboardingSteps current={user ? 2 : 1} />
      <p className="text-sm font-semibold text-primary">{user ? "Step 2 of 3" : "Step 1 of 3"}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{user ? "Tell us about your ranch" : "Create your administrator account"}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{user ? "We’ll create your ranch and administrator membership together when you finish." : "This account will become the first Ranch Administrator."}</p>
      {user ? <RanchForm defaultEmail={user.email ?? ""} /> : <SignUpForm />}
    </div>
  );
}
