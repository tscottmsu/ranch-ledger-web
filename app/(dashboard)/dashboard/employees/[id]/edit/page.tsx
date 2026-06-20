import { notFound } from "next/navigation";
import { FormShell } from "@/features/dashboard/components/form-shell";
import { EmployeeForm } from "@/features/employees/components/employee-form";
import { getEmployee } from "@/features/employees/services/employee-service";
export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const employee = await getEmployee(id); if (!employee) notFound(); return <FormShell title="Edit employee" description="Update this ranch staff record." backHref="/dashboard/employees"><EmployeeForm employee={employee} /></FormShell>; }
