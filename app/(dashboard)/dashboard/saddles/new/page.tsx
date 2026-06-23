import { FormShell } from "@/features/dashboard/components/form-shell";
import { SaddleForm } from "@/features/saddles/components/saddle-form";

export default function NewSaddlePage() {
  return <FormShell title="Add saddle" description="Create tack fit details for guest prep recommendations." backHref="/dashboard/saddles"><SaddleForm /></FormShell>;
}
