"use client";
export function Badge({ children, variant="secondary" }:{ children: any; variant?: "secondary" | "default" }){
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs";
  const cls = variant==="secondary" ? "bg-muted text-foreground border border-border" : "bg-primary text-white";
  return <span className={`${base} ${cls}`}>{children}</span>;
}
export default Badge;
