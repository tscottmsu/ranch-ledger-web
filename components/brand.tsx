import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandMark({ className, prominent = false }: { className?: string; prominent?: boolean }) {
  return <svg viewBox="0 0 48 56" aria-hidden="true" className={cn(prominent ? "h-16 w-[3.45rem] sm:h-20 sm:w-[4.3rem]" : "size-9", className)} fill="none">
    <path d="M24 2.8 43 11v16.8c0 12.2-7.7 20.7-19 25.4C12.7 48.5 5 40 5 27.8V11L24 2.8Z" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" />
    <path d="M14 21.5c1.8-5.4 5.4-8.1 10-8.1s8.2 2.7 10 8.1M15 37.5h18M18 43h12" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
    <text x="24" y="32.5" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="800" fontFamily="ui-sans-serif, system-ui">RL</text>
  </svg>;
}

export function Brand({ className, compact = false, href = "/", prominent = false }: { className?: string; compact?: boolean; href?: string; prominent?: boolean }) {
  return <Link href={href} className={cn("inline-flex items-center gap-2.5 text-foreground", prominent && "gap-4", className)}>
    <BrandMark prominent={prominent} className="shrink-0 text-primary" />
    {!compact && <span className="leading-none"><span className={cn("block font-extrabold uppercase tracking-[0.14em]", prominent ? "text-xl sm:text-2xl" : "text-sm")}>Ranch</span><span className={cn("block font-semibold uppercase tracking-[0.3em] text-primary", prominent ? "mt-2 text-xs sm:text-sm" : "mt-1 text-[10px]")}>Ledger</span></span>}
  </Link>;
}
