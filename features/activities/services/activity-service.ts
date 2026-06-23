import "server-only";

import { requireOperationsManager } from "@/features/ranch/services/ranch-context-service";
import { archiveActivityRecord, findActivities, findActivity, findActivityOptions, insertActivity, updateActivityRecord } from "../repositories/activity-repository";
import type { ActivityStatus } from "../types";

export type ActivityInput = { activity_type_id: string; trail_id: string | null; name: string | null; activity_date: string; start_time: string | null; end_time: string | null; status: ActivityStatus; capacity: number | null; notes: string | null };

export async function listActivities() { const { ranchId } = await requireOperationsManager(); return findActivities(ranchId); }
export async function getActivity(id: string) { const { ranchId } = await requireOperationsManager(); return findActivity(ranchId, id); }
export async function getActivityFormOptions() { const { ranchId } = await requireOperationsManager(); return findActivityOptions(ranchId); }
export async function createActivity(input: ActivityInput) { const { ranchId } = await requireOperationsManager(); return insertActivity(ranchId, input); }
export async function updateActivity(id: string, input: ActivityInput) { const { ranchId } = await requireOperationsManager(); return updateActivityRecord(ranchId, id, input); }
export async function updateActivityStatus(id: string, status: ActivityStatus) { const { ranchId } = await requireOperationsManager(); return updateActivityRecord(ranchId, id, { status }); }
export async function archiveActivity(id: string) { const { ranchId } = await requireOperationsManager(); return archiveActivityRecord(ranchId, id); }
