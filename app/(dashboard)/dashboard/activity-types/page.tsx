import type { Metadata } from "next";
import { ActivityTypeList } from "@/features/activity-types/components/activity-type-list";
import { listActivityTypes } from "@/features/activity-types/services/activity-type-service";
import { PageHeader } from "@/features/dashboard/components/page-header";
export const metadata: Metadata = { title: "Activity Types" };
export default async function ActivityTypesPage() { const activityTypes = await listActivityTypes(); return <><PageHeader title="Activity Types" description="Define the kinds of experiences this ranch can offer." actionHref="/dashboard/activity-types/new" actionLabel="Add activity type" /><ActivityTypeList activityTypes={activityTypes} /></>; }
