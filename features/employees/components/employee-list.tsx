"use client";

import { useMemo, useState } from "react";
import { Archive, Pencil, Search, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { archiveEmployeeAction } from "../services/employee-actions";
import type { Employee } from "../types";

function archiveMessage(name: string) { return `${name} will be hidden from daily operations but kept for history. Archive this employee?`; }

export function EmployeeList({ employees }: { employees: Employee[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => employees.filter((employee) => [employee.first_name, employee.last_name, employee.nickname, employee.email, employee.phone, employee.position, employee.employment_status].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase())), [employees, query]);
  if (!employees.length) return <EmptyState icon={Users} title="No employees yet" description="Add the ranch staff records needed for daily operations. Login access remains separate." href="/dashboard/employees/new" action="Add employee" />;
  return <div className="space-y-4"><label className="flex h-10 max-w-md items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees" className="h-full flex-1 bg-transparent text-foreground outline-none" /></label><div className="overflow-hidden rounded-2xl border bg-card"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Position</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y">{filtered.map((employee) => {
    const name = `${employee.first_name} ${employee.last_name}`;
    return <tr key={employee.id} className="hover:bg-muted/20"><td className="px-5 py-4 font-medium">{name}{employee.nickname && <span className="block text-xs font-normal text-muted-foreground">&quot;{employee.nickname}&quot;</span>}</td><td className="px-5 py-4 text-muted-foreground">{employee.position || "Not set"}</td><td className="px-5 py-4 text-muted-foreground">{employee.email || employee.phone || "Not set"}</td><td className="px-5 py-4"><Badge className={employee.employment_status === "active" ? "bg-primary/10 text-primary" : ""}>{employee.employment_status}</Badge></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Button asChild variant="ghost" size="icon" aria-label="Edit employee"><Link href={`/dashboard/employees/${employee.id}/edit`}><Pencil /></Link></Button>{employee.employment_status === "active" && <form action={archiveEmployeeAction.bind(null, employee.id)} onSubmit={(event) => { if (!window.confirm(archiveMessage(name))) event.preventDefault(); }}><Button variant="ghost" size="icon" aria-label="Archive employee"><Archive /></Button></form>}</div></td></tr>;
  })}{!filtered.length && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No employees match that search.</td></tr>}</tbody></table></div></div></div>;
}
