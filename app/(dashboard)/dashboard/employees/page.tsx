import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { EmployeeList } from "@/features/employees/components/employee-list";
import { listEmployees } from "@/features/employees/services/employee-service";
export const metadata: Metadata = { title: "Employees" };
export default async function EmployeesPage() { const employees = await listEmployees(); return <><PageHeader title="Employees" description="Manage ranch staff records independently from login access." actionHref="/dashboard/employees/new" actionLabel="Add employee" /><EmployeeList employees={employees} /></>; }
