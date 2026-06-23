import type { Metadata } from "next";
import { ActivityList } from "@/features/activities/components/activity-list";
import { listActivities } from "@/features/activities/services/activity-service";
import { PageHeader } from "@/features/dashboard/components/page-header";
export const metadata: Metadata = { title: "Activities" };
export default async function ActivitiesPage() { const activities = await listActivities(); return <><PageHeader title="Activities" description="Schedule ranch events and track their operational status." actionHref="/dashboard/activities/new" actionLabel="Schedule activity" /><ActivityList activities={activities} /></>; }
