"use client";

import { useState } from "react";
import { Activity, Gauge, LogOut, Menu, Mountain, PawPrint, Settings, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/features/authentication/services/auth-actions";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/employees", label: "Employees", icon: Users },
  { href: "/dashboard/horses", label: "Horses", icon: PawPrint },
  { href: "/dashboard/trails", label: "Trails", icon: Mountain },
  { href: "/dashboard/activity-types", label: "Activity Types", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function Navigation({ pathname, close }: { pathname: string; close?: () => void }) {
  return <nav className="mt-8 space-y-1">{links.map(({ href, label, icon: Icon }) => { const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} onClick={close} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground")}><Icon className="size-4.5" />{label}</Link>; })}</nav>;
}

export function DashboardShell({ ranchName, email, children }: { ranchName?: string; email?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-muted/30 lg:pl-64">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar p-5 lg:flex lg:flex-col"><Brand /><div className="mt-7 rounded-xl border bg-background/60 p-3"><p className="truncate text-sm font-medium">{ranchName ?? "Ranch setup"}</p><p className="mt-1 truncate text-xs text-muted-foreground">{email}</p></div><Navigation pathname={pathname} /><form action={logoutAction} className="mt-auto"><Button type="submit" variant="ghost" className="w-full justify-start"><LogOut />Sign out</Button></form></aside>
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden"><Brand /><Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></Button></header>
    {open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label="Close navigation" /><aside className="relative flex h-full w-72 flex-col bg-sidebar p-5 shadow-xl"><div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></Button></div><Navigation pathname={pathname} close={() => setOpen(false)} /><form action={logoutAction} className="mt-auto"><Button type="submit" variant="ghost" className="w-full justify-start"><LogOut />Sign out</Button></form></aside></div>}
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10">{children}</main>
  </div>;
}
