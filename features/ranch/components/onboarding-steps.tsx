import { Check } from "lucide-react";

export function OnboardingSteps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Administrator account", "Ranch details", "Administrator access"];
  return <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Onboarding progress">{steps.map((step, index) => { const number = index + 1; const complete = number < current; const active = number === current; return <li key={step} className="text-xs text-muted-foreground"><span className={`mb-2 grid size-7 place-items-center rounded-full border font-semibold ${complete || active ? "border-primary bg-primary text-primary-foreground" : "bg-background"}`}>{complete ? <Check className="size-4" /> : number}</span><span className={active ? "font-medium text-foreground" : ""}>{step}</span></li>; })}</ol>;
}
