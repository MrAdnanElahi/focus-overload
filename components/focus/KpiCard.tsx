"use client";
import { Progress } from "@/components/ui/progress";
export default function KpiCard({ title, value, sub, progress }:{ title:string; value:string; sub?:string; progress?:number; }){
  return (
    <div className="card-surface p-4 gradient-border">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      {typeof progress === "number" && <div className="mt-2"><Progress value={Math.round(progress*100)} /></div>}
    </div>
  );
}
