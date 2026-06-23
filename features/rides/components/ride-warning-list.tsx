import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

import type { RideValidationWarning } from "../types";

const severityStyles = {
  info: { icon: Info, className: "border-sky-200 bg-sky-50 text-sky-900" },
  warning: { icon: AlertTriangle, className: "border-orange-200 bg-orange-50 text-orange-950" },
  blocking: { icon: AlertTriangle, className: "border-red-200 bg-red-50 text-red-950" },
};

export function RideWarningList({ warnings }: { warnings: RideValidationWarning[] }) {
  if (!warnings.length) {
    return <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"><CheckCircle2 className="size-4" />No blocking warnings. This ride is ready for a final check.</div>;
  }
  return <div className="space-y-2">{warnings.map((warning) => {
    const style = severityStyles[warning.severity];
    const Icon = style.icon;
    return <div key={warning.id} className={`rounded-lg border px-3 py-2 text-sm ${style.className}`}><div className="flex items-start gap-2"><Icon className="mt-0.5 size-4 shrink-0" /><div><p className="font-semibold">{warning.title}</p>{warning.message && <p className="mt-1 leading-5 opacity-80">{warning.message}</p>}</div></div></div>;
  })}</div>;
}
