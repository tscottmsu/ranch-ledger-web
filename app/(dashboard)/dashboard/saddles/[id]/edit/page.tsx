import { notFound } from "next/navigation";
import { FormShell } from "@/features/dashboard/components/form-shell";
import { SaddleForm } from "@/features/saddles/components/saddle-form";
import { getSaddle } from "@/features/saddles/data/saddle-service";

export default async function EditSaddlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const saddle = await getSaddle(id);
  if (!saddle) notFound();
  return <FormShell title="Edit saddle" description="Update tack fit, status, and notes." backHref="/dashboard/saddles"><SaddleForm saddle={saddle} /></FormShell>;
}
