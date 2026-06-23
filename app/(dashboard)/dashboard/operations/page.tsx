import type { Metadata } from "next";
import { OperationsBoard } from "@/features/rides/components/operations-board";
import { getTodaysRideOperations } from "@/features/rides/data/ride-service";

export const metadata: Metadata = { title: "Ride Operations" };

export default async function OperationsPage() {
  const snapshot = await getTodaysRideOperations();
  return <OperationsBoard snapshot={snapshot} />;
}
