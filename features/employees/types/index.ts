export type Employee = { id: string; ranch_id: string; first_name: string; last_name: string; nickname: string | null; phone: string | null; email: string | null; position: string | null; employment_status: "active" | "inactive"; hire_date: string | null; notes: string | null; created_at: string; updated_at: string };
export type EmployeeFormState = { status: "idle" | "error"; message?: string; fieldErrors?: Partial<Record<"firstName" | "lastName" | "email", string>> };
export const initialEmployeeFormState: EmployeeFormState = { status: "idle" };
