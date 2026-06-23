import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SaddleList } from "@/features/saddles/components/saddle-list";
import { listSaddles } from "@/features/saddles/data/saddle-service";

export const metadata: Metadata = { title: "Saddles" };

export default async function SaddlesPage() {
  const saddles = await listSaddles();
  return <><PageHeader title="Saddles" description="Maintain tack fit details used for guest prep and ride assignments." actionHref="/dashboard/saddles/new" actionLabel="Add saddle" /><SaddleList saddles={saddles} /></>;
}
