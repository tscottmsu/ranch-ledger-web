import { FormShell } from "@/features/dashboard/components/form-shell";
import { EmployeeForm } from "@/features/employees/components/employee-form";
export default function NewEmployeePage() { return <FormShell title="Add employee" description="Create an operational staff record for this ranch." backHref="/dashboard/employees"><EmployeeForm /></FormShell>; }
