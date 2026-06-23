import "server-only";

import { requireOperationsManager } from "@/features/ranch/services/ranch-context-service";
import { findOperationsForDate } from "../repositories/operations-repository";
import type { OperationsSnapshot } from "../types";

function currentDateInTimezone(timezone: string) { const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()); const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ""; return `${value("year")}-${value("month")}-${value("day")}`; }

export async function getTodaysOperations(): Promise<OperationsSnapshot> {
  const context = await requireOperationsManager();
  const date = currentDateInTimezone(context.timezone);
  const data = await findOperationsForDate(context.ranchId, date);
  return { date, timezone: context.timezone, ...data, counts: { total: data.activities.length, drafts: data.activities.filter((item) => item.status === "draft").length, ready: data.activities.filter((item) => item.status === "ready").length, inProgress: data.activities.filter((item) => item.status === "in_progress").length, completed: data.activities.filter((item) => item.status === "completed").length } };
}
