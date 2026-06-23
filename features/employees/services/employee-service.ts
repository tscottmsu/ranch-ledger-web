import "server-only";

import { requireRanchAdministrator } from "@/features/ranch/services/ranch-context-service";
import { createClient } from "@/lib/supabase/server";
import type { Employee } from "../types";

export type EmployeeInput = Omit<Employee, "id" | "ranch_id" | "created_at" | "updated_at" | "employment_status">;

export async function listEmployees(): Promise<Employee[]> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("employees").select("*").eq("ranch_id", ranchId).order("employment_status").order("last_name"); if (error) throw error; return data as Employee[]; }
export async function getEmployee(id: string): Promise<Employee | null> { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); const { data, error } = await supabase.from("employees").select("*").eq("ranch_id", ranchId).eq("id", id).maybeSingle(); if (error) throw error; return data as Employee | null; }
export async function createEmployee(input: EmployeeInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("employees").insert({ ...input, ranch_id: ranchId }); }
export async function updateEmployee(id: string, input: EmployeeInput) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("employees").update(input).eq("ranch_id", ranchId).eq("id", id); }
export async function archiveEmployee(id: string) { const { ranchId } = await requireRanchAdministrator(); const supabase = await createClient(); return supabase.from("employees").update({ employment_status: "inactive" }).eq("ranch_id", ranchId).eq("id", id); }
