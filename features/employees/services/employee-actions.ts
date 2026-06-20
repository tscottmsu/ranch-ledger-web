"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { archiveEmployee, createEmployee, updateEmployee, type EmployeeInput } from "./employee-service";
import type { EmployeeFormState } from "../types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function parse(formData: FormData): { input?: EmployeeInput; state?: EmployeeFormState } { const value = (key: string) => String(formData.get(key) ?? "").trim(); const firstName = value("firstName"); const lastName = value("lastName"); const email = value("email"); const fieldErrors: EmployeeFormState["fieldErrors"] = {}; if (!firstName) fieldErrors.firstName = "First name is required."; if (!lastName) fieldErrors.lastName = "Last name is required."; if (email && !emailPattern.test(email)) fieldErrors.email = "Enter a valid email."; if (Object.keys(fieldErrors).length) return { state: { status: "error", fieldErrors } }; return { input: { first_name: firstName, last_name: lastName, nickname: value("nickname") || null, phone: value("phone") || null, email: email || null, position: value("position") || null, hire_date: value("hireDate") || null, notes: value("notes") || null } }; }
export async function createEmployeeAction(_state: EmployeeFormState, formData: FormData): Promise<EmployeeFormState> { const parsed = parse(formData); if (parsed.state) return parsed.state; const { error } = await createEmployee(parsed.input!); if (error) return { status: "error", message: error.message }; revalidatePath("/dashboard"); redirect("/dashboard/employees"); }
export async function updateEmployeeAction(id: string, _state: EmployeeFormState, formData: FormData): Promise<EmployeeFormState> { const parsed = parse(formData); if (parsed.state) return parsed.state; const { error } = await updateEmployee(id, parsed.input!); if (error) return { status: "error", message: error.message }; revalidatePath("/dashboard"); redirect("/dashboard/employees"); }
export async function archiveEmployeeAction(id: string) { const { error } = await archiveEmployee(id); if (error) throw new Error("Unable to archive employee."); revalidatePath("/dashboard/employees"); revalidatePath("/dashboard"); }
