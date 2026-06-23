import type { ActivityWithRelations } from "@/features/activities/types";

export type ArrivalReservation = { id: string; reservation_name: string | null; primary_contact_name: string | null; status: string };
export type OperationsSnapshot = { date: string; timezone: string; activities: ActivityWithRelations[]; checkedInGuests: number; readyGuests: number; arrivals: ArrivalReservation[]; counts: { total: number; drafts: number; ready: number; inProgress: number; completed: number } };
