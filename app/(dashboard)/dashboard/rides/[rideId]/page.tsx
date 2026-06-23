import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RideBuilder } from "@/features/rides/components/ride-builder";
import { getRideBuilderData } from "@/features/rides/data/ride-service";

export const metadata: Metadata = { title: "Ride Builder" };

export default async function RideBuilderPage({ params }: { params: Promise<{ rideId: string }> }) {
  const { rideId } = await params;
  const data = await getRideBuilderData(rideId);
  if (!data) notFound();
  return <RideBuilder ride={data.ride} trails={data.trails} eligibleGuests={data.eligibleGuests} availableHorses={data.availableHorses} availableWranglers={data.availableWranglers} />;
}
