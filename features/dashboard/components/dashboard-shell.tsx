"use client";

import { useState } from "react";
import { Activity, Armchair, CalendarClock, CalendarRange, Gauge, LogOut, Menu, Mountain, PawPrint, Settings, Sunrise, UserRound, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/authentication/services/auth-actions";
import type { CurrentRanchContext } from "@/features/ranch/services/ranch-context-service";
import { cn } from "@/lib/utils";

const administratorLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/operations", label: "Today's Operations", icon: Sunrise },
  { href: "/dashboard/activities", label: "Activities", icon: CalendarClock },
  { href: "/dashboard/reservations", label: "Reservations", icon: CalendarRange },
  { href: "/dashboard/guests", label: "Guests", icon: UserRound },
  { href: "/dashboard/employees", label: "Employees", icon: Users },
  { href: "/dashboard/horses", label: "Horses", icon: PawPrint },
  { href: "/dashboard/saddles", label: "Saddles", icon: Armchair },
  { href: "/dashboard/trails", label: "Trails", icon: Mountain },
  { href: "/dashboard/activity-types", label: "Activity Types", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const operationsLinks = administratorLinks.slice(0, 3);
type Role = CurrentRanchContext["role"];

function Navigation({ pathname, role, close }: { pathname: string; role?: Role; close?: () => void }) {
  const links = role === "ranch_administrator" ? administratorLinks : role === "head_wrangler" ? operationsLinks : administratorLinks.slice(0, 1);
  return <nav className="mt-7 space-y-1">{links.map(({ href, label, icon: Icon }) => {
    const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
    return <Link key={href} href={href} onClick={close} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-sidebar-foreground/65 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground")}><Icon className="size-4.5" />{label}</Link>;
  })}</nav>;
}

export function DashboardShell({ ranchName, role, email, children }: { ranchName?: string; role?: Role; email?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-muted/30 lg:pl-64">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar p-5 text-sidebar-foreground lg:flex lg:flex-col"><Brand href="/dashboard" className="text-sidebar-foreground" /><div className="mt-7 rounded-xl border border-sidebar-border bg-white/5 p-3"><p className="truncate text-sm font-medium">{ranchName ?? "Ranch setup"}</p><p className="mt-1 truncate text-xs text-sidebar-foreground/55">{email}</p></div><Navigation pathname={pathname} role={role} /><form action={logoutAction} className="mt-auto"><Button type="submit" variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground"><LogOut />Sign out</Button></form></aside>
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden"><Brand href="/dashboard" /><Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></Button></header>
    {open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Close navigation" /><aside className="relative flex h-full w-72 flex-col bg-sidebar p-5 text-sidebar-foreground shadow-xl"><div className="flex items-center justify-between"><Brand href="/dashboard" className="text-sidebar-foreground" /><Button variant="ghost" size="icon" className="text-sidebar-foreground" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></Button></div><Navigation pathname={pathname} role={role} close={() => setOpen(false)} /><form action={logoutAction} className="mt-auto"><Button type="submit" variant="ghost" className="w-full justify-start text-sidebar-foreground"><LogOut />Sign out</Button></form></aside></div>}
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10">{children}</main>
  </div>;
}
